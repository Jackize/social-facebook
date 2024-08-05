import { configureStore } from '@reduxjs/toolkit';
import { loadState } from '../utils/localStorage';
import notificationReducer from './notificationSlice';
import socketReducer from './socketSlice';
import userReducer from './userSlice';

const preloadedState = loadState();
const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if ( action.type?.startsWith('user/') ) {
    const authState = store.getState().user;
    localStorage.setItem('user', JSON.stringify(authState))
  }
  return result;
};
const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
  preloadedState
});

export default store;
