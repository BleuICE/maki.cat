var ytdl = require("ytdl-core");
var fs = require("fs");
var request = require("request");

var yt_api = {
	search: "https://www.googleapis.com/youtube/v3/search?key="+global.token.youtube+"&type=video&part=snippet&maxResults=24&q=",
	video: "https://www.googleapis.com/youtube/v3/videos?key="+global.token.youtube+"&part=snippet&id="
}

global.app.get("/tube/api", function(req, res) {
	if (req.query.v != undefined) {
		res.set("Content-Type", "video/mp4");
		ytdl(req.query.v).pipe(res);
		return;
	}

	if (req.query.a != undefined) {
		res.set("Content-Type", "audio/webm");

		//ffmpeg().input(ytdl(req.query.a, { filter: "audioonly" })).format("wav").pipe(res);
		ytdl(req.query.a, { filter: "audioonly" }).pipe(res);
		return;
	}

	if (req.query.s != undefined) {
		request({url: yt_api.search+req.query.s}, function (err, r_res, body) {
			res.send(body);

			// let yt_log = JSON.parse(
			// 	fs.readFileSync(__dirname+"/yt_log.json")
			// )

			// yt_log[moment().format("HH:mm:ss DD/MM/YY")+""] = req.query.s;

			//fs.writeFileSync(__dirname+"/yt_log.json", JSON.stringify(yt_log, null, 4));
		});
		return;
	}

	res.send(":3c"); 	
});

global.app.get("/tube", function(req, res) {
	res.send(fs.readFileSync(global.__dirname+global.dir.public+"/tube/index.html")+"");
});

// app.get("/tube/kek", function(req, res) {
// 	io.emit("tube.load", req.query.hehe)
// 	res.send("nice!:3c");
// });
