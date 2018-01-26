var fs = require("fs");
var Screenshot = require("url-to-screenshot");

global.app.get("/screenshot/:service", function(req, res) {
	
	switch (req.params.service) {
		case "discord-celeste":

			new Screenshot("https://discordapp.com/widget?id=406379938468331522&theme=dark")
				.width(285).height(400)
				.capture().then(function(img) {
					res.set("Content-Type", "image/png");
					res.send(img);
				});
			break;

		default:

			res.send("Service not found.")
			break;
	}

});