const app = require("./app");
const { createServer } = require("http");
const { PORT } = require("./src/utils/config");
const { info } = require("./src/utils/logger");
const { Server } = require("socket.io");
const { initialSocket } = require("./src/socket");

const server = createServer(app);
const io = initialSocket(server)
let userList = []
io.on("connection", (socket) => {
    console.log(socket.id);
    // when user login
    socket.on("userLogin", (user) => {
        const existUser = userList.some(users => users.id === user.id)
        if (!existUser) {
            userList.push(user)
        }
        console.log('after login', userList);
    })

    socket.on("userLogout", (user) => {
        const existUser = userList.some(users => users.id === user.id)
        if (existUser) {
            userList = userList.filter(a => a.id !== user.id)
        }
        console.log('after logout', userList);
    })
    // Handle join room event
    socket.on("joinRoom", (roomId, userId) => {
        info(`${userId} joined room ${roomId}`);
        info(socket.rooms, socket.id)
        socket.join(roomId);
        socket.to(roomId).emit("user joined", userId, roomId);
    });

    // Handle leave room event
    socket.on("leaveRoom", (roomId, userId) => {
        info(`${userId} left room ${roomId}`);
        socket.leave(roomId);
        socket.to(roomId).emit("user left", userId, roomId);
    });

    // Handle send message event
    socket.on("sendMessage", ({ roomId, senderId, message }) => {
        info(`${senderId} sent message in room ${roomId}: ${message}`);
        socket.to(roomId).emit("new message", senderId, message);
    });

    socket.on('offer', (roomId, offer) => {
        console.log('on offer');
        // Broadcast the offer to other users in the room
        // socket.to(data.roomId).emit('offer', data.offer);
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
        console.log('on answer');
        // Broadcast the answer to other users in the room
        socket.to(roomId).emit('answer', answer);
        // socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, cand) => {
        console.log('on ice-candidate');
        // Broadcast the ICE candidate to other users in the room
        socket.to(roomId).emit('ice-candidate', cand);
        // socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('reject', (roomId, isCancle) => {
        console.log('on reject');
        // socket.broadcast.emit('reject', isTrue)
        socket.to(roomId).emit('reject', isCancle)
    })

    socket.on('endMeeting', (roomId, isEnd) => {
        console.log('on endMeeting');
        // socket.broadcast.emit('endMeeting')
        socket.to(roomId).emit('endMeeting', isEnd)
    })
    // when disconnect
    socket.on("disconnect", () => {
        info("Client disconnected");
    });
});

server.listen(PORT || 8080, () => {
    info(`Server running on port ${PORT}`);
});
