const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const moment = require("moment");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"../public");
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user");

    socket.on("join", (params,callback) => {
        if(!isRealString(params.name) || !isRealString((params.room))) {
            return callback("Name and room name are required");
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit("updateUserList", users.getUserList(params.room));
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
        let user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit("updateUserList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left the channel`));
        }
    })
});

server.listen(3000, () => {
    console.log("Server is running port", port);
});




