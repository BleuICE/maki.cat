var srequest = require("sync-request");
var fs = require("fs");

global.app.get("/iplol", function (req, res) {
	let ip4 = req.ip.split(":")[3]

	res.send(
		(fs.readFileSync(global.__dirname+global.dir.public+"/iplol/index.html")+"")
		.replace(/\[name\]/g, ip4)
		.replace(/\[where\]/g, JSON.parse(srequest("GET", "https://freegeoip.net/json/"+ip4).getBody()).country_name)
	)
});