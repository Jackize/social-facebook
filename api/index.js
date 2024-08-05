const app = require("./app");
const { createServer } = require("http");
const { PORT } = require("./src/utils/config");
const { info } = require("./src/utils/logger");
const { Server } = require("socket.io");
const { initialSocket } = require("./src/socket");
const { User } = require("./src/models");
const { v4 } = require("uuid");
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
    },
    // secure: true
});

let userList = []
io.on("connection", (socket) => {
    // when user login
    socket.on("userLogin", (user) => {
        if (!user) return
        const existUser = userList.some(users => users.id === user.id)
        if (!existUser) {
            userList.push({ ...user, socketId: socket.id })
            io.emit('userStatus', userList);
        }
    })

    // listen get user online
    socket.on('getFriendOfUser', (users) => {
        console.log("🚀 ~ socket.on ~ getFriendOfUser:", users)
        if (!users) return
        let userOnline = userList.filter(user => users.some(userGet => userGet.id === user.id))
        socket.emit('receiverOnline', userOnline)
    })

    // Handle like post notification
    socket.on('likePost', async (data) => {
        const { userId, postId, postOwnerId } = data;
        const postOwner = userList.find(u => u.id === postOwnerId);
        const userNameLikePost = await User.findOne({ where: { id: userId } });
        if (postOwner) {
            io.to(postOwner.socketId).emit('notification', {
                type: 'LIKE_POST',
                data: { id: v4(), userId, postId, userName: userNameLikePost?.username, postOwnerId }
            });
        } else {
            const user = await User.findOne({ where: { id: postOwnerId } });
            if (user) {
                io.to(socket.id).emit('notification', {
                    type: 'LIKE_POST',
                    data: { userId, postId, postOwnerId }
                });
            }
        }
    });

    // Handle join room event
    socket.on("joinRoom", (roomId, userId) => {
        if (!roomId || !userId) return
        socket.join(roomId);
        socket.to(roomId).emit("user joined", userId);
    });

    // Handle leave room event
    socket.on("leaveRoom", (roomId, userId) => {
        if (!roomId || !userId) return
        socket.leave(roomId);
        socket.to(roomId).emit("user left", userId, roomId);
    });

    // Handle send message event
    socket.on("sendMessage", (message) => {
        if (!message) return
        socket.to(message.conversationId).emit("new message", message);
    });

    socket.on('offer', (roomId, offer) => {
        if (!roomId || !offer) return
        console.log('on offer', roomId);
        // Broadcast the offer to other users in the room
        // socket.to(data.roomId).emit('offer', data.offer);
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
        if (!roomId || !answer) return
        console.log('on answer');
        // Broadcast the answer to other users in the room
        socket.to(roomId).emit('answer', answer);
        // socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, cand) => {
        if (!roomId || !cand) return
        console.log('on ice-candidate', roomId);
        // Broadcast the ICE candidate to other users in the room
        socket.to(roomId).emit('ice-candidate', cand);
        // socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('reject', (roomId, isCancle) => {
        if (!roomId || isCancle === undefined) return
        console.log('on reject');
        // socket.broadcast.emit('reject', isTrue)
        socket.to(roomId).emit('reject', isCancle)
    })

    socket.on('endMeeting', (roomId, isEnd) => {
        if (!roomId || isEnd === undefined) return
        console.log('on endMeeting');
        // socket.broadcast.emit('endMeeting')
        socket.to(roomId).emit('endMeeting', isEnd)
    })
    // when disconnect
    socket.on("disconnect", () => {
        userList = userList.filter(u => u.socketId !== socket.id);
        io.emit('userStatus', userList);
    });
});

server.listen(PORT || 8080, () => {
    console.clear()
    info(`Server running on port ${PORT}`);
});
