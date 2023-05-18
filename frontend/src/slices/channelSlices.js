import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const defaultChannelId = 1;
const initialState = {
  channels: [],
  currentChannelId: defaultChannelId,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, { payload }) => ({ ...state, channels: payload }),
    setCurrentChannelId: (state, { payload }) => ({ ...state, currentChannelId: payload }),
    addChannel: (state, { payload: { channel } }) => {
      state.channels.push(channel);
    },
    renameChannel: (state, { payload: { id, name } }) => {
      const channel = state.channels.find((ch) => (ch.id === id));
      channel.name = name;
    },
    removeChannel: (state, { payload: { id } }) => {
      state.channels = state.channels.filter((channel) => (channel.id !== id));
      if (state.currentChannelId === id) {
        state.currentChannelId = _.first(state.channels).id;
      }
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
