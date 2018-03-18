var request = require("request");

global.app.get("/scdl/stream/:id", function(req, res) {
	request("http://api.soundcloud.com/tracks/"+req.params.id+"/stream?client_id="+global.token.soundcloud).pipe(res);
});

global.app.get("/scdl/search/:q", function(req, res) {
	request("http://api.soundcloud.com/tracks/?q="+req.params.q+"&client_id="+global.token.soundcloud, function(err, r_res, body) {
		var json = JSON.parse(body);
		var array = [];
		for (var i=0; i<json.length; i++) {
			array.push({
				id: json[i].id,
				title: json[i].title,
				username: json[i].username,
				duration: json[i].duration,
				likes_count: json[i].likes_count,
			});
		}
		res.send(array);
	});
});