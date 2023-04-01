import { combineReducers, configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';

const reducer = combineReducers({
  channels: channelsReducer,
});

export default configureStore({
  reducer,
});
