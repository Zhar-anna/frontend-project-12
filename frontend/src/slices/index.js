import { combineReducers, configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelSlices.js';
import messagesReducer from './MessageSlices.js';
import currentChannelIdReducer from './currentChannelIdSlice.js';

const reducer = combineReducers({
  messages: messagesReducer,
  channels: channelsReducer,
  currentChannelId: currentChannelIdReducer,
});

export default configureStore({
  reducer,
});
