var fs = require("fs");

global.app.get("/bg", function(req, res) {
	fs.readdir(global.__dirname+"/public/gifs", function(err, files) {
		data = files.filter(val=>val !== "1041uuu.url");
		res.sendFile(global.__dirname+"/public/gifs/"+data[Math.floor(Math.random()*data.length)]);
	})
});