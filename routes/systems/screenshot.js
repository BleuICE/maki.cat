var fs = require("fs");
var Screenshot = require("url-to-screenshot");

global.app.get("/screenshot/:service", function(req, res) {
	
	switch (req.params.service) {
		case "discord":
			res.send("nice");
			break;
		default:
			res.send("Service not found.")
			break;		
	}

});