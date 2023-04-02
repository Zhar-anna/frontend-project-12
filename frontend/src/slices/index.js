import { combineReducers, configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelSlices.js';

const reducer = combineReducers({
  channels: channelsReducer,
});

export default configureStore({
  reducer,
});
