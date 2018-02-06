var fs = require("fs");
var moment = require("moment");

global.app.get("*", function(req, res){
	res.status(404);
	res.send(
		fs.readFileSync(global.__dirname+global.dir.public+"/error/404.html", "utf8")
			.replace(/\[ip\]/g, req.ip.split(":")[3])
			.replace(/\[year\]/g, moment().year())
	);
});
