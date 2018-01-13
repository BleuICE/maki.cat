// ----------------------------------------------------------------
// ----------------------------------------------------------------
var place = {
	board_path: "board.json",
	board_size: 512,
	save_interval: 2000,
	place_timeout: 200,
}
// ----------------------------------------------------------------
// ----------------------------------------------------------------

var moment = require("moment");
var fs = require("fs");
var io = global.io.of("/place");

global.log = function(ee) {console.log(ee);};

var game = {
	players: 0,
	chat: "",
	timeout: place.place_timeout
}

var board = [];

var timeout = {};

// Game Initialisation

global.log("Place: Loading board from "+place.board_path)
fs.stat(__dirname+"/"+place.board_path, function(err, stats) {
	if (err) {
		global.log("Place: Board not found, generating...");
		board = new Array(place.board_size*place.board_size).fill(7);
		fs.writeFileSync(__dirname+"/"+place.board_path, JSON.stringify(board));
		global.log("Place: Board generated and saved!");
	} else {
		global.log("Place: Board loaded!");
		board = JSON.parse(fs.readFileSync(__dirname+"/"+place.board_path))
	}
});

// Web Server

global.app.get("/place", function (req, res) {
	res.send(fs.readFileSync(__dirname+"/game.html", "utf8"));
});

// Socket.io

io.on("connection", function(socket) {

	let ip = socket.handshake.address.split(":")[3];
	timeout[socket.id] = moment().valueOf();

	game.players++;
	global.log("Place: " + ip + " joined! ("+game.players+" playing)");

	socket.on("disconnect", function() {
		game.players--;
		global.log("Place: " + ip + " left! ("+game.players+" playing)");
		io.emit("game", game);
	});

	io.emit("game", game);

	socket.emit("load-board", {
		board: board,
		board_size: place.board_size
	});

	socket.on("place-pixel", function(res) {
		let now = moment().valueOf();
		if (
			(res.x>=0 && res.x<place.board_size) &&
			(res.y>=0 && res.y<place.board_size) &&
			(res.c>=0 && res.c<16) &&
			(now > timeout[socket.id])
		) {
			board[res.x+(res.y*place.board_size)] = res.c;
			//global.log(ip + " placed at "+res.x+","+res.y);
			io.emit("place-pixel", res);
			timeout[socket.id] = now+game.timeout;
		}
	});

});

// Saving

setInterval(function() {
	if (game.players > 0) fs.writeFileSync(__dirname+"/"+place.board_path, JSON.stringify(board));
}, place.save_interval); // Save board every 10 seconds