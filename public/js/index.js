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

socket.on("newLocationMessage", function(message) {
   let li = $("<li></li>");
   let a = $("<a target='_blank'>My current location</a>");

   li.text(`${message.from}: `);
   a.attr("href", message.url);
   li.append(a);
   $("#messages").append(li);
});

$("#message-form").on("submit", function (e) {
    e.preventDefault();

    let messageTextBox = $("[name=message]");

    socket.emit("createMessage", {
        from: "User",
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val("");
    });
});

let locationButton = $("#send-location");
locationButton.on("click", function () {
   if(!navigator.geolocation) {
       return alert("Geolocation not available");
   }

   locationButton.attr("disabled","disabled").text("Sending...");
   navigator.geolocation.getCurrentPosition(function(position) {
       locationButton.removeAttr("disabled").text("Send Location");
       socket.emit("createLocationMessage", {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       });
   }, function () {
       locationButton.removeAttr("disabled").text("Send Location");
       alert("Unable to fetch location");
   });
});




