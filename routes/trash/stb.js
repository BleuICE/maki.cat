// Basically my ICT teacher wasn't at school this one day,
// and another teacher told us to try out Scratch.
//
// I kek'ed so hard and decided to get one of my friends
// and I asked that he had to come up with a random idea within 5 seconds.
//
// He said "The Stanly Parable baby scene with the baby into the fire"
//
// Then I spent two days working on this whilst in other classes.
//     "lol... fuck school amiright"

var moment = require("moment");

var stb = {
	online: 0,
	users: {}
}

global.io.on("connection", function(socket) {

	var hs = socket.handshake.headers.referer.split("/");
	if (hs.includes("savethebaby") == false) { return; }

	global.io.emit("stb.info", stb);

	socket.on("stb.data", function(obj) {
		stb.users[obj.name] = obj.clicks;
		//console.log(stb);
	});	
});

setInterval(function() {
	stb.online=Object.keys(stb.users).length;
	global.io.emit("stb.info", stb);
	stb.users={};
}, 2000); // 1s