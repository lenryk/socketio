const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"../public");
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user");

    socket.emit("newMessage", {
        from: "Admin",
        text: "Welcome to the chat app"
    });

    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "New user joined",
        createdAt: new Date().getTime()
    })

    socket.on("createMessage", (message) => {
       console.log(message);
     /*  io.emit("newMessage", {
           from: message.from,
           text: message.text,
           createdAt: new Date().getTime()
       });*/
        socket.broadcast.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});

server.listen(3000, () => {
    console.log("Server is running port", port);
});




