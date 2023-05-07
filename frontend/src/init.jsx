/* eslint-disable react/jsx-no-constructed-context-values */

import React from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import App from './App.jsx';
import { actions as messagesActions } from './slices/MessageSlices.js';
import { actions as channelsActions } from './slices/channelSlices.js';
import { ChatApiContext } from './contexts/index.jsx';
import store from './slices/index.js';

const socketTimeoutMs = 5000;

export default async () => {
  const socket = io();
  console.debug(`Subscribe for socket events (socket.id=${socket.id})`);
  socket
    .on('connect', () => {
      console.debug(`socket "connect" id=${socket.id}`);
    })
    .on('connect', () => {
      console.debug('socket "connect_error"');
    })
    .on('disconnect', (reason) => {
      console.debug(`socket "disconnect" (${reason})`);
    })

    .on('newMessage', (payload) => {
      console.debug('newMessage "event"', payload);
      store.dispatch(messagesActions.addMessage(payload));
    })
    .on('newChannel', (payload) => {
      console.debug('newChannel "event"', payload);
      store.dispatch(channelsActions.addChannel(payload));
      toast.info('Канал создан');
    })
    .on('removeChannel', (payload) => {
      console.debug('removeChannel "event"', payload);
      store.dispatch(channelsActions.removeChannel(payload.id));
      toast.info('Канал удалён');
    })
    .on('renameChannel', (payload) => {
      console.debug('renameChannel "event"', payload);
      const { id, name } = payload;
      store.dispatch(channelsActions.updateChannel({ id, changes: { name } }));
      toast.info('Канал переименован');
    });
  const getSocketEmitPromise = (...args) => new Promise((resolve, reject) => {
    socket.timeout(socketTimeoutMs).emit(...args, (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
  const chatApi = {
    newMessage: (...args) => getSocketEmitPromise('newMessage', ...args),
    newChannel: (...args) => getSocketEmitPromise('newChannel', ...args),
    removeChannel: (...args) => getSocketEmitPromise('removeChannel', ...args),
    renameChannel: (...args) => getSocketEmitPromise('renameChannel', ...args),
  };
  const rollbarConfig = {
    accessToken: '30c8dfe987dc44809bfa1796486cf0a7',
    captureUncaught: true,
    environment: 'production',
  };
  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <ChatApiContext.Provider value={chatApi}>
            <App />
            <ToastContainer pauseOnFocusLoss={false} position="top-center" />
          </ChatApiContext.Provider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};
