import { createAction, createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { SOCKET_SERVER } from "../utils/config";
import store from './store';
export let socket = io(SOCKET_SERVER);
const initialState = {
    connected: false,
    userList: [],
};

export const updateUserList = createAction('socket/updateUserList');

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connectSocket: (state, action) => {
            socket = io(SOCKET_SERVER);
            if (socket) {
                state.connected = true;
                // Emit userLogin event
                socket.emit('userLogin', action.payload);
                // Listen for userStatus event
                socket.on('userStatus', (data) => {
                    store.dispatch(updateUserList(data.userList));
                });
            }
        },
        disconnectSocket: (state, action) => {
            if (socket) {
                socket.disconnect();
                state.connected = false;
            }
        },
        emitEvent: (state, action) => {
            if (socket) {
                socket.emit(action.payload.event, action.payload.data);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateUserList, (state, action) => {
            state.userList = action.payload;
        });
    },
});

export const { connectSocket, disconnectSocket, emitEvent } = socketSlice.actions;

export default socketSlice.reducer;
