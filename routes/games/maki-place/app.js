var express = require("express");
var moment = require("moment");
var fs = require("fs");
var PNG = require("pngjs").PNG;

var game = {
	online: 0,
	restart: true
}

var timeout = {};

// LITTLE FUNCTIONS

function genColor() {
	let c = global.place.palette[8+Math.floor(Math.random()*(global.place.palette.length/2))];
	return ("#"+
		("00"+Math.floor(c[0]).toString(16)).slice(-2)+
		("00"+Math.floor(c[1]).toString(16)).slice(-2)+
		("00"+Math.floor(c[2]).toString(16)).slice(-2));
}

// Web Server

global.app.use("/place", express.static(__dirname+"/public"))

global.app.get("/place", function(req, res) {
	let public_places = "";
	let protected_places = "";

	let end = '</p></a></td>';
	for (var i=0; i<Object.keys(global.place.places).length; i++) {
		let name = Object.keys(global.place.places)[i];
		let place = global.place.places[name];

		let html = '<div id="place" style="background-image: url(https://maki.cat/place/'+
			name.toLowerCase()+'.png);"><a href="https://maki.cat/place/'+
			name.toLowerCase()+'"><div class="rel"><p>'+
			name+'</p><p>'+place.board_size+"x"+place.board_size+'</p><p>'+
			place.public.place_timeout+'ms</p><p>'+place.public.online+'</p></div></a></div>';
	
		if (place.token) {
			protected_places += html;
		} else {
			public_places += html;
		}
	}

	res.send(
		fs.readFileSync(__dirname+"/places.html", "utf8")
			.replace(/\[public_places\]/gi, public_places)
			.replace(/\[protected_places\]/gi, protected_places)
	);
});

function webGetPlace(place, name) {
	let miner = (place.miner)? "https://coinhive.com/lib/coinhive.min.js": "";
	global.app.get("/place/"+name.toLowerCase(), function (req, res) {
		res.send(
			fs.readFileSync(__dirname+"/game.html", "utf8")
				.replace(/\[url\]/gi, "https://"+global.domain+"/place/"+name.toLowerCase())
				.replace(/\[board_size\]/gi, place.board_size)
				.replace(/\[socket_namespace\]/gi, name)
				.replace(/\[socket_namespace_lower\]/gi, name.toLowerCase())
				.replace(/\[palette\]/gi, JSON.stringify(global.place.palette))
				.replace(/\[miner\]/gi, miner)
		);
	});
}

// Functions

function makeImagePlace(place, name, force) {
	var board_png = new PNG({width: place.board_size, height: place.board_size});

	if (force || place.public.online>0) {
		for (var y=0; y<place.board_size; y++) {
			for (var x=0; x<place.board_size; x++) {
				var pixel = x+(y*place.board_size);
				board_png.data[4*pixel] = global.place.palette[place.board[pixel]][0];
				board_png.data[4*pixel+1] = global.place.palette[place.board[pixel]][1];
				board_png.data[4*pixel+2] = global.place.palette[place.board[pixel]][2];
				board_png.data[4*pixel+3] = 255;
			}
		}
	
		board_png.pack()
			.pipe(fs.createWriteStream(__dirname+"/public/"+name.toLowerCase()+".png"));
			// .on("finish", function() { console.log('Written!'); });	
	}
}

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

		setInterval(function() {
			makeImagePlace(place, name, false);
		}, 10*1000); makeImagePlace(place, name, true); // 10 seconds
	});
}

// Socket.io

function makePlace(place, name) {

	let io = global.io.of("/place/"+name);
	place.public.online = 0;
	place.public.name = name;
	place.players = {};
	place.public.protected = (place.token)? true: false;

	io.on("connection", function(socket) {

		if (game.restart) {
			io.emit("server-restart");
		}

		let ip = socket.handshake.address.split(":")[3];
		timeout[socket.id] = moment().valueOf();

		let chat_color = genColor();
		place.players[socket.id] = {name: "_Player", color: chat_color};
		place.public.players = Object.values(place.players);

		place.public.online++;
		global.log("Place: '"+name+"' " + ip + " joined! ("+place.public.online+" playing)");

		socket.on("disconnect", function() {
			place.public.online--;
			delete place.players[socket.id];
			place.public.players = Object.values(place.players);
			global.log("Place: '"+name+"' " + ip + " left! ("+place.public.online+" playing)");
			io.emit("game", place.public);
		});

		io.emit("game", place.public);

		socket.emit("load-board", {
			board: place.board,
			board_size: place.board_size
		});

		// socket.on(200, function() {
		// 	socket.emit(200);
		// });

		let chat_name = 0;
		for (var i=0; i<ip.split(".").length; i++) {
			chat_name += parseInt(ip.split(".")[i])
		}

		//chat_name = (ip=="192.168.1.1")? "Maki": ("000"+chat_name).slice(-4);
		//let chat_color = (ip=="192.168.1.1")? "#F0B4B4": "rgb("+ip.split(".")[0]+","+ip.split(".")[1]+","+ip.split(".")[2]+")";

		socket.on("chat-message", function(res) {
			if (res == "") return;
			//if (res.name) updateName(res.name);
			io.emit("chat-message", {
				color: chat_color,
				name: place.players[socket.id].name, 
				message: res.message
			});
			//if (res.message == "maki!reload") io.emit("reload-page");
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

		function updateName(name) {
			place.players[socket.id].name = name.replace(/\s/gi, "");
			place.public.players = Object.values(place.players);
			io.emit("game", place.public);
		}

		socket.on("name-change", function(name) {
			updateName(name);
		});
	});

	// Saving

	setInterval(function() {
		if (place.public.online > 0) fs.writeFileSync(__dirname+"/places/"+place.board_path, JSON.stringify(place.board));
	}, 2000); // Save board every 2 seconds
}

// Initialization

for (var i=0; i<Object.keys(global.place.places).length; i++) {
	let name = Object.keys(global.place.places)[i];
	let place = global.place.places[name];

	webGetPlace(place, name);
	loadPlace(place, name);
	makePlace(place, name);

	setTimeout(function() {
		game.restart = false;
	}, 1000);
}