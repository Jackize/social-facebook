const app = require("./app");
const { createServer } = require("http");
const { PORT } = require("./src/utils/config");
const { info } = require("./src/utils/logger");
const { Server } = require("socket.io");
const { User } = require("./src/models");
const { v4 } = require("uuid");
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
    },
});

let userList = []
let rooms = []
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
                data: { id: v4(), userId, postId, senderName: userNameLikePost?.username, postOwnerId }
            });
        }
    });

    // Handle join room event
    socket.on("joinRoom", ({ conversationId, userId, peerId }) => {
        if (!conversationId || !userId || !peerId) return
        if (!rooms[conversationId]) rooms[conversationId] = []
        const user = userList.find(u => u.id === userId);
        if (!rooms[conversationId].some(u => u.peerId === peerId)) {
            rooms[conversationId].push({ peerId, userId, socketId: user.socketId });
            socket.join(conversationId);
            // socket.to(conversationId).emit("user-joined", { peerId });
            // socket.emit("get-users", {
            //     conversationId,
            //     participants: rooms[conversationId]
            // });
        }
        console.log(rooms)
        socket.on("disconnect", () => {
            console.log("user left the room", peerId);
            rooms[conversationId] = rooms[conversationId].filter(u => u.peerId !== peerId);
            socket.to(conversationId).emit("user-disconnected", peerId);
        });
    });

    // Handle leave room event
    socket.on("leaveRoom", ({ conservationId, userId, peerId }) => {
        if (!conservationId || !userId || !peerId) return
        rooms[conservationId] = rooms[conservationId].filter(u => u.userId !== userId);
        console.log(rooms)
        socket.leave(roomId);
        socket.to(roomId).emit("user left", userId, roomId, peerId);
    });

    // Handle send message event
    socket.on("sendMessage", (message) => {
        if (!message) return
        const receiver = userList.find(u => u.id === message.receiverId);
        if (receiver) {
            socket.to(message.conversationId).emit("new message", message);
            io.to(receiver.socketId).emit("notification", {
                type: "CHAT",
                data: message,
            });
        }
    });

    socket.on('offer', ({ conversationId, peerId, userId }) => {
        if (!conversationId || !peerId || !userId) return
        const otherUser = userList.filter(u => u.id !== userId);
        if (rooms[conversationId].some(u => u.peerId === peerId) && otherUser.length === 1) {
            console.log('emit offer')
            socket.join(conversationId);
            // send event call to conversationId with peerId of user2
            socket.to(conversationId).emit('call', { conversationId, peerId });
        }
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
