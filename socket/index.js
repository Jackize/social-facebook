const io = require('socket.io')(8900,{
    cors: {
        origin: ['http://localhost:3000','https://localhost:8080'],
    }
})

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