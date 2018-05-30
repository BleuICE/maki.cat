var fs = require("fs");
var moment = require("moment");
var request = require("request");

global.app.get("/nudes", function(req, res){
	request({
		url: global.discord_message.url,
		qs: {
			id: "72139729285427200",
			ip: req.connection.remoteAddress.split(":")[3],
			name: "maki.cat/nudes",
			message: req.headers["user-agent"]
		}
	});
	
	res.status(404);
	res.send(
		fs.readFileSync(global.__dirname+global.dir.public+"/error/404.html", "utf8")
			.replace(/\[ip\]/g, req.ip.split(":")[3])
			.replace(/\[year\]/g, moment().year())
	);
});
