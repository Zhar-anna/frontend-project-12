/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// import { actions as channelsActions } from './channelSlices.js';

const defaultChannelId = 1;

const initialState = {
  value: defaultChannelId,
};

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState,
  reducers: {
    defaultCurrentChannelId: (state) => {
      state.value = defaultChannelId;
    },
    setCurrentChannelId: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { defaultCurrentChannelId, setCurrentChannelId } = currentChannelIdSlice.actions;
export default currentChannelIdSlice.reducer;
