var fs = require("fs");

global.app.get("/", function (req, res) {
	var stats = JSON.parse(fs.readFileSync(global.__dirname+global.dir.stats));
	stats.page_refreshes++; fs.writeFileSync(global.__dirname+global.dir.stats, JSON.stringify(stats, null, 4));
	// other stats here idk

	var instagram_posts = "";

	for (var i=0; i<global.instagram.posts.length; i++) {
		
		instagram_posts +=
			'<td width="33.32%" style="vertical-align: top;"><a target="_blank" href="'+
			global.instagram.posts[i].link+'"><div style="background-image: url('+global.instagram.posts[i].url+
			')"></div></a></td>';

		if ((i+1)%3===0 && i!=(global.instagram.count-1)) { instagram_posts += "</tr><tr>"; }
	}


	res.send(
		fs.readFileSync(global.__dirname+global.dir.public+"/index.html", "utf8")
			.replace(/\[page_refreshes\]/g, stats.page_refreshes)
			.replace(/\[instagram_posts\]/g, instagram_posts)
	);
});