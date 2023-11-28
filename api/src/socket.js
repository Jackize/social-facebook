const { Server } = require("socket.io");

let io
const initialSocket = (app) => {
    io = new Server(app, {
        cors: {
            origin: "*",
            credentials: true,
            optionsSuccessStatus: 200,
        },
        // secure: true
    });
    return io
}

const getIo = () => {
    if (!io) {
        throw new Error('Socket is not initial!')
    }
    return io
}

module.exports = {
    initialSocket,
    getIo
}