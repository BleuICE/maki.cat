var request = require("request");
var fs = require("fs");

global.app.get("/git", function (req, res) {
	
	request({
		url: "https://api.github.com/users/makixx/repos",
		headers: {
			"User-Agent": "Maki"
		}
	}, function(err, rres, body) {
		res.send(
			fs.readFileSync(global.__dirname+global.dir.public+"/git/index.html", "utf8")
				.replace(/\[data\]/gi, body)
		)	
	});
});