const app = require('./app');
const http = require('http');

const config = require('./src/utils/config');
const logger = require('./src/utils/logger');

const server = http.createServer(app);
const io = require('socket.io')(server)

let users = []

const addUser= (userId, socketId) => {
    !users.some(user => user.userId === userId) && 
        users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
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
    socket.on("disconnect", ()=>{
        console.log('a user disconnected');
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})

const PORT = config.PORT || 8080;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
