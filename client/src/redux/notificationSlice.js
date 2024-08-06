import { createSlice } from '@reduxjs/toolkit';
import { NotificationTypes } from "../type/notificationType";

export const createNotification = (type, payload) => {
  switch (type) {
    case NotificationTypes.ADD_FRIEND:
      return {
        type,
        message: `${payload.senderName} sent you a friend request.`,
        data: payload,
      };
    case NotificationTypes.LIKE_POST:
      return {
        type,
        message: `${payload.senderName} liked your post.`,
        data: payload,
      };
    case NotificationTypes.CHAT:
      return {
        type,
        message: `${payload.senderName} sent you a message.`,
        data: payload,
      };
    default:
      return {
        type,
        message: 'You have a new notification.',
        data: payload,
      };
  }
};

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      if (state.length > 0) {
        const index = state.findIndex((n) => n.data.id === action.payload.data.id);
        if (index !== -1) {
          state[index] = createNotification(action.payload.type, action.payload.data);
          return;
        }
      } else {
        state.push(createNotification(action.payload.type, action.payload.data));
      }
    },
    clearNotifications: (state) => {
      return [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;