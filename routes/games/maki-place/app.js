var moment = require("moment");
var fs = require("fs");

global.log = function(ee) {console.log(ee);};

var game = {
	online: 0
}

var timeout = {};

// Web Server

global.app.get("/place", function(req, res) {
	res.redirect("/place/public")
});

function webGetPlace(name) {
	global.app.get("/place/"+name, function (req, res) {
		res.send(
			fs.readFileSync(__dirname+"/game.html", "utf8")
				.replace(/\[socket_namespace\]/gi, name)
		);
	});
}

// Functions

function loadPlace(place, name) {

	global.log("Place: Loading board from "+place.board_path)
	fs.stat(__dirname+"/places/"+place.board_path, function(err, stats) {
		if (err) {
			global.log("Place: '"+name+"' not found, generating...");
			place.board = new Array(place.board_size*place.board_size).fill(7);
			fs.writeFileSync(__dirname+"/places/"+place.board_path, JSON.stringify(place.board));
			global.log("Place: '"+name+"' generated and saved!");
		} else {
			global.log("Place: '"+name+"' loaded!");
			place.board = JSON.parse(fs.readFileSync(__dirname+"/places/"+place.board_path))
		}
	});
	
}

// Socket.io

function makePlace(place, name) {

	let io = global.io.of("/place/"+name);
	place.public.online = 0;
	place.public.name = name;
	place.public.protected = (place.token)? true: false;

	io.on("connection", function(socket) {

		let ip = socket.handshake.address.split(":")[3];
		timeout[socket.id] = moment().valueOf();

		place.public.online++;
		global.log("Place: '"+name+"' " + ip + " joined! ("+place.public.online+" playing)");

		socket.on("disconnect", function() {
			place.public.online--;
			global.log("Place: '"+name+"' " + ip + " left! ("+place.public.online+" playing)");
			io.emit("game", place.public);
		});

		io.emit("game", place.public);

		socket.emit("load-board", {
			board: place.board,
			board_size: place.board_size
		});

		socket.on(200, function() {
			socket.emit(200);
		});

		socket.on("place-pixel", function(res) {
			let now = moment().valueOf();
			if (
				(res.x>=0 && res.x<place.board_size) &&
				(res.y>=0 && res.y<place.board_size) &&
				(res.c>=0 && res.c<16) &&
				(now > timeout[socket.id]) &&
				(res.token == place.token)
			) {
				place.board[res.x+(res.y*place.board_size)] = res.c;
				//global.log(ip + " placed at "+res.x+","+res.y);
				io.emit("place-pixel", res);
				timeout[socket.id] = now+place.public.place_timeout;
			}
		});
	});

	// Saving

	setInterval(function() {
		if (place.public.online > 0) fs.writeFileSync(__dirname+"/places/"+place.board_path, JSON.stringify(place.board));
	}, 2000); // Save board every 2 seconds
}

// Initialisation

for (var i=0; i<Object.keys(global.places).length; i++) {
	let name = Object.keys(global.places)[i];
	let place = global.places[Object.keys(global.places)[i]];

	webGetPlace(name);
	loadPlace(place, name);
	makePlace(place, name);
}