import { combineReducers, configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelSlices.js';
import messagesReducer from './MessageSleces.js';

const reducer = combineReducers({
  messages: messagesReducer,
  channels: channelsReducer,
});

export default configureStore({
  reducer,
});
