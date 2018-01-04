var request = require("request");

global.app.get("/gproxy", function(req, res) {
	if (req.query.url == undefined) { res.send("Provide ?url="); return; }
	res.redirect("https://translate.google.com/translate?hl=en&sl=zu&tl=en&u="+req.query.url);	
});

global.app.get("/proxy", function(req, res) {
	// request({
	// 	url: req.query.url,
	// }, function (err, rres, body) {
	// 	if (err) { res.send("kek"); return; }
		
	// 	rres.pipe(res);
	// 	//res.set("content-type", rres["headers"]["content-type"]);
	// 	//res.write(body
	// 		//.replace(/http\:\/\//g, "https://maki.cat/proxy/?url=http://")
	// 		//.replace(/https\:\/\//g, "https://maki.cat/proxy/?url=https://")
			
	// 		//.replace(/src="(?!http)/g, 'src="https://maki.cat/proxy/?url='+req.query.url+"/")
	// 		//.replace(/href="(?!http)/g, 'href="https://maki.cat/proxy/?url='+req.query.url)
	// 	//);	
	// });
	
	var body = req.pipe(request(req.query.url));
	
	//fs.writeFileSync(__dirname+"/nice.json", JSON.stringify(request(req.query.url), null, 4));
	
	body.pipe(res);
});