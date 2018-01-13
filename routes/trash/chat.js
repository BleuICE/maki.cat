// Fun fact: I made this on one of the last days of school
// Didnt have any lessons... ¯\_(ツ)_/¯

var moment = require("moment");
var io = global.io.of("/chat");

var chat = {
	messages: [],
	room: {
		name: "general",
		online: 0,
		users: []
	}
}

io.on("connection", function(socket) {

	var hs = socket.handshake.headers.referer.split("/");
	if (hs.includes("chat") == false) { return; }

	chat.room.online++;
	io.emit("roomInfo", chat.room);
	socket.emit("receiveAll", chat.messages);
	
	socket.on("send", function(data) {
		data.date = moment();
		
		chat.messages.push(data);
		io.emit("receive", data);
	});
	
	socket.on("clearChat", function() {
		chat.messages = [];
		io.emit("clearChat");
	})
	
	socket.on("disconnect", function() {
		chat.room.online--;
		io.emit("roomInfo", chat.room);
		//console.log("A user disconnected");
	});		
});