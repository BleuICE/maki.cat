var fs = require("fs");
var Screenshot = require("url-to-screenshot");

global.app.get("/screenshot/:service", function(req, res) {
	
	switch (req.params.service) {
		case "discord-celeste":
			
			new Screenshot('http://ghub.io/')
				.width(800).height(600)
				.capture().then(function(img) {
					res.send(img);
			});
			break;
			
		default:

			res.send("Service not found.")
			break;
	}

});