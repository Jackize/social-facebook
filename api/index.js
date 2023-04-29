const app = require("./app");
const http = require("http");

const config = require("./src/utils/config");
const logger = require("./src/utils/logger");

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
    },
    // secure: true
});

io.on("connection", (socket) => {
    //when connect
    console.log("New client connected");

    //Handle join room event
    socket.on("joinRoom", (roomId, userId) => {
        console.log(`${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user joined", userId, roomId);
    });

    //Handle leave room event
    socket.on("leaveRoom", (roomId, userId) => {
        console.log(`${userId} left room ${roomId}`);
        socket.leave(roomId);
        socket.to(roomId).emit("user left", userId, roomId);
    });

    //Handle send message event
    socket.on("sendMessage", ({ roomId, senderId, message }) => {
        console.log(`${senderId} sent message in room ${roomId}: ${message}`);
        socket.to(roomId).emit("new message", senderId, message);
    });
    //when disconnect
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = config.PORT || 8080;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
