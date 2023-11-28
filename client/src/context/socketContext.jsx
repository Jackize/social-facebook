import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { SOCKET_SERVER } from "../utils/config";

export const SocketContext = createContext();
let socket = io(SOCKET_SERVER, {
    withCredentials: true,
    transports: ["websocket"],
    extraHeaders: {
        "Content-Type": "application/json",
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    forceNew: false,
    timeout: 20000,
});
export default function SocketContextProider({ children }) {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocketContext = () => {
    const socket = useContext(SocketContext);
    return socket;
};