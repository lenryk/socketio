let socket = io();
socket.on("connect", function()  {
    console.log("Connected to server");
});

socket.on("disconnect", function() {
    console.log("Disconnected from server");
});

socket.on("newMessage",function(msg) {
   console.log(msg.from +" says: " +msg.text);
   let li = $("<li></li>");
   li.text(`${msg.from}: ${msg.text}`);

   $("#messages").append(li);
});

$("#message-form").on("submit", function (e) {
    e.preventDefault();

    socket.emit("createMessage", {
        from: "User",
        text: $("[name=message]").val()
    }, function () {

    });
});


