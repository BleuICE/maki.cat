var fs = require("fs");
var md = require("markdown-it")({
	html: true,
	linkify: true
});

global.app.get("*.md/preview", (req, res) => {
	let path = global.__dirname+global.dir.public+req.originalUrl.replace(/\/preview/gi, "");
	if (!fs.existsSync(path)) res.redirect("/");
	let filename = req.originalUrl.replace(/\/preview/gi, "").slice(1);

	res.send(
		fs.readFileSync(__dirname+"/markdown.html", "utf8")
		.replace(/\[md\]/gi, md.render(
			fs.readFileSync(path, "utf8")
		))
		.replace(/\[title\]/gi, filename)
	)
});