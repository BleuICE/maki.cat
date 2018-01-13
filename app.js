//  __  __       _    _              _   
// |  \/  |     | |  (_)            | |  
// | \  / | __ _| | ___    ___  __ _| |_ 
// | |\/| |/ _` | |/ / |  / __|/ _` | __|
// | |  | | (_| |   <| |_| (__| (_| | |_ 
// |_|  |_|\__,_|_|\_\_(_)\___|\__,_|\__|
// 

var moment = require("moment");
var express = require("express");
var fs = require("fs");
var http = express();
var spdy = require("spdy");

// Global settings
global = require(__dirname+"/settings");
global.__dirname = __dirname;
global.log = function(msg) {
	console.log("["+moment().format("HH:mm:ss, DD/MM/YY")+"] "+msg);
}

// Initialise express
global.app = express();
global.spdy = spdy.createServer({
	cert: fs.readFileSync(global.secure.cert),
	key: fs.readFileSync(global.secure.key)
}, global.app).listen(global.port.https, function (err) {
	if (err) { global.log(err); return process.exit(1); }
	global.log("HTTPS on *:"+global.port.https);
});

http.get("*", function(req, res) {  
    res.redirect("https://"+global.domain+req.url);
});

http.listen(global.port.http, function (err) {
	if (err) { global.log(err); return process.exit(1); }
	global.log("HTTP on *:"+global.port.http);
});
global.io = require("socket.io")(global.spdy);

// Other
require(__dirname+"/modules/logging");

// Libraries
global.app.use("/socket.io", express.static(__dirname+"/node_modules/socket.io-client/dist"));
global.app.use("/moment", express.static(__dirname+"/node_modules/moment/min"));
global.app.use("/base64", express.static(__dirname+"/node_modules/base-64"));

// Timers
require(__dirname+"/timers/instagram");

// Routes
	// Pages
	require(__dirname+"/routes/pages/main");
	require(__dirname+"/routes/pages/iplol");
	require(__dirname+"/routes/pages/discord");
	require(__dirname+"/routes/pages/polaristhicc");
	
	// Systems
	require(__dirname+"/routes/systems/redirect");
	require(__dirname+"/routes/systems/upload");
	require(__dirname+"/routes/systems/proxy");
	require(__dirname+"/routes/systems/bg");

	// Trash/Games
	require(__dirname+"/routes/trash/tube");
	require(__dirname+"/routes/trash/chat");
	require(__dirname+"/routes/trash/stb");

	// Games
	require(__dirname+"/routes/games/maki-place/app");

	// Rip
	global.app.use(express.static(__dirname+global.dir.public));
	require(__dirname+"/routes/pages/404");