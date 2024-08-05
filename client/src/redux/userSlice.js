import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { makeRequest } from '../axios';
import { connectSocket, disconnectSocket } from './socketSlice';

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ username, password }, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await makeRequest.post("/auth/login", { username, password });
      const { user, token } = response.data;

      // Save token in a cookie
      Cookies.set('token', token, { expires: 7 }); // expires in 7 days

      // Connect the socket and emit login event
      dispatch(connectSocket(user));

      // Return the user data and token
      return { user, token };
    } catch (error) {
      // Return a rejected action with an error message
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (user, { dispatch }) => {
    // Emit the logout event
    dispatch(clearUser());
    
    // Close the socket connection
    dispatch(disconnectSocket(user));

    // Cookie remove token
    Cookies.remove('token');

    // Make a request to the server to logout
    await makeRequest.post("/auth/logout");
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
