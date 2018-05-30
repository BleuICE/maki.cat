var express = require("express");
var fs = require("fs");

let path = "/home/max/maki.js/backgrounds";

global.app.get("/makijs-bg", function (req, res) {
	let backgrounds = fs.readdirSync(path);
	backgrounds.splice(backgrounds.indexOf("ADD 400x120 IMAGES HERE"), 1);

	let html = fs.readFileSync(global.__dirname+"/public/makijs-bg.html", "utf8")
		.replace(/\[data\]/g, JSON.stringify(backgrounds));

	res.send(html);
	//res.send(backgrounds);
});

global.app.use("/makijs-bgs", express.static(path));