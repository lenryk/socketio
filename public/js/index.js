let socket = io();
socket.on("connect", function()  {
    console.log("Connected to server");
});

socket.on("disconnect", function() {
    console.log("Disconnected from server");
});

socket.on("newMessage",function(msg) {
    let formattedTime = moment(msg.createdAt).format("h:mm a");
    let template = $("#message-template").html();
    let html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);
});

socket.on("newLocationMessage", function(message) {
    let formattedTime = moment(message.createdAt).format("h:mm a");
    let template = $("#location-message-template").html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });


   $("#messages").append(html);
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




