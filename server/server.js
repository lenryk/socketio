const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const moment = require("moment");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"../public");
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user");

    socket.on("join", (params,callback) => {
        if(!isRealString(params.name) || !isRealString((params.room))) {
            callback("Name and room name are required");
        }
        socket.join(params.room);

        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined.`));
        callback();
    });

    socket.on("createMessage", (message,callback) => {
       console.log(message);
        io.emit("newMessage", generateMessage(message.from,message.text));
        callback();
    });

    socket.on("createLocationMessage", (coords) => {
        let formattedTime = moment(coords.createdAt).format("h:mm a");
        io.emit("newLocationMessage", generateLocationMessage(`Admin`,coords.latitude,coords.longitude));
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});

server.listen(3000, () => {
    console.log("Server is running port", port);
});




