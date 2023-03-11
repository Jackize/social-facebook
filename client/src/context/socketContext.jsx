import { CircularProgress } from "@mui/material";
import React, { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";
import { SOCKET_SERVER } from "../utils/config";
import { AuthContext } from "./authContext";

export const SocketContext = createContext();

export default function SocketContextProider({ children }) {
    const {currentUser} = useContext(AuthContext);
    const socket = io.connect(SOCKET_SERVER);
    

    useEffect(() => {
        currentUser?.id && socket.emit("addUser", currentUser.id)
        return () => {
            socket.disconnect();
        };
    }, [currentUser, socket]);

    if (!socket) {
        return <CircularProgress />;
    }

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>);
}
