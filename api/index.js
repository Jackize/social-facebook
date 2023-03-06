const app = require('./app');
const http = require('http');

const config = require('./src/utils/config');
const logger = require('./src/utils/logger');

const server = http.createServer(app);
const io = require('socket.io')(server,{
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8080','https://nth-social-api.fly.dev'],
    }
})

let users = []

const addUser= (userId, socketId) => {
    !users.some(user => user.userId === userId) && 
        users.push({userId, socketId})
}

const removeUser = (userId) => {
    users = users.filter(user => user.userId !== userId)
}

const getUser = (userId) =>{
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    //when connect
    console.log("a user connected");
    console.log(users);
    //take userId and socketId from user
    socket.on("addUser", userId=>{
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    //send and get message
    socket.on("sendMessage",({senderId, receiverId, content}) =>{
        const user = getUser(receiverId)
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                content
            })
        } else {
            socket.emit("getMessage", {
                senderId,
                content
            })
        }
    })
    //when disconnect
    socket.on("removeUser", ({userId})=>{
        removeUser(userId)
        console.log('a user disconnected', {userId});
        io.emit("getUsers", users)
    })
})

const PORT = config.PORT || 8080;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
