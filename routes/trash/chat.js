// Fun fact: I made this on one of the last days of school
// Didnt have any lessons... ¯\_(ツ)_/¯

var moment = require("moment");

var chat = {
	messages: [],
	room: {
		name: "general",
		online: 0,
		users: []
	}
}

global.io.on("connection", function(socket) {

	var hs = socket.handshake.headers.referer.split("/");
	if (hs.includes("chat") == false) { return; }

	chat.room.online++;
	global.io.emit("chat.roomInfo", chat.room);
	socket.emit("chat.receiveAll", chat.messages);
	
	socket.on("chat.send", function(data) {
		data.date = moment();
		
		chat.messages.push(data);
		global.io.emit("chat.receive", data);
	});
	
	socket.on("chat.clearChat", function() {
		chat.messages = [];
		global.io.emit("chat.clearChat");
	})
	
	socket.on("disconnect", function() {
		chat.room.online--;
		global.io.emit("chat.roomInfo", chat.room);
		//console.log("A user disconnected");
	});		
});