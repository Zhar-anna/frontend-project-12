/* eslint-disable react/jsx-no-constructed-context-values */

import React from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
// выше будет + импорт toast
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import App from './App.jsx';
import { actions as messagesActions } from './slices/MessageSlices.js';
// import { actions as channelsActions } from './slices/channelSlices.js';
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
    });
  const getSocketEmitPromise = (...args) => new Promise((resolve, reject) => {
    socket.timeout(socketTimeoutMs).emit(...args, (err, response) => {
      if (err) reject(err); // the other side did not acknowledge the event in the given delay
      resolve(response);
    });
  });
  const chatApi = {
    newMessage: (...args) => getSocketEmitPromise('newMessage', ...args),
  };
  const rollbarConfig = {
    accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
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
