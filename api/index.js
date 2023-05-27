import app from "./app.js";
import { createServer } from "http";
import { PORT as _PORT } from "./src/utils/config.js";
import { info } from "./src/utils/logger.js";
import { Server } from "socket.io";

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
    },
    // secure: true
});

io.on("connection", (socket) => {
    // when connect
    console.log("New client connected");

    // Handle join room event
    socket.on("joinRoom", (roomId, userId) => {
        console.log(`${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user joined", userId, roomId);
    });

    // Handle leave room event
    socket.on("leaveRoom", (roomId, userId) => {
        console.log(`${userId} left room ${roomId}`);
        socket.leave(roomId);
        socket.to(roomId).emit("user left", userId, roomId);
    });

    // Handle send message event
    socket.on("sendMessage", ({ roomId, senderId, message }) => {
        console.log(`${senderId} sent message in room ${roomId}: ${message}`);
        socket.to(roomId).emit("new message", senderId, message);
    });

    // when disconnect
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = _PORT || 8080;
server.listen(PORT, () => {
    info(`Server running on port ${PORT}`);
});
