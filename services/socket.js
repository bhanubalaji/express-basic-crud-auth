const socketio = require("socket.io");

let io = null;
const socketConnection = (server) => {
     io = socketio(server);
     // auth middle ware
     io.use((socket, next) => {
        let userId = socket?.handshake?.query?.userId;
        if (userId) {
            socket.userId = userId; // for later use 
            return next();
        } else {
            socket.disconnect();
        }
    });
    io.on("connection", async function(socket, next) {
        try {
           socket.on("message", async (data) => {
               console.log(data)
            //    io.emit("message", data+ socket.userId) // to all socket connected
               io.sockets.to(socket.id).emit("message", data+"from server"+ socket.userId); // to single socket connected by sockect id reference
           })
            socket.on("disconnect", async () => {
                try {
                    console.log("Socket disconnected");
                } catch (err) {
                    console.log(err);
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    });
};

module.exports = {socketConnection}