var request = require("request");
var fs = require("fs");
var moment = require("moment");

function getRepoIndex(repos, name) {
	for (var i = 0; i < repos.length; i++) {
		if (name == repos[i]["name"]) return i;
	}; return null;
}

function makeHTMLRepo(repo) {
	return '<a href="'+repo["html_url"]+'"><div id="git">'+
		'<h2>'+repo["name"]+'</h2>'+
		'<p>'+repo["description"]+'</p><br>'+
		'<p class="gray">Language: '+repo["language"]+'</p>'+
		'<p class="gray">Last Updated: '+repo["updated_at"]+'</p>'+
	'</div></a>';
}

global.app.get("/git", function (req, res) {
	
	request({
		url: "https://api.github.com/users/makixx/repos",
		headers: { "User-Agent": "Maki" }
	}, function(err, rres, body) {
		let repos = JSON.parse(body)
		let html = "";
		let categories = {
			"Useful": [
				"cloudflare-ddns",
				"makis-blender-tools",
			],
			"Scripts/Info": [
				"asdf-scripts",
				"useful-resources",
			],
			"Learning": [
				"fuck-js",
				"project-euler",
				"fantasy-carts",
			],
			"Unfinished": [
				"dots-and-boxes",
				"image-board",
				"nagakunai",
			],
			"Stupid": [

			],
		};

		for (var i = 0; i < Object.keys(categories).length; i++) {
			let key = Object.keys(categories)[i];
			html += "<h1>"+key+"</h1>";
			let category = categories[key];
			for (var j = 0; j < category.length; j++) {
				let repoIndex = getRepoIndex(repos, category[j]);
				if (!repoIndex) continue;

				let repo = repos[repoIndex];
				html += makeHTMLRepo(repo);
				repos[repoIndex] = "";
			}
		}

		addedTitle = false;
		for (var i = 0; i < repos.length; i++) {
			let repo = repos[i];
			if (!repo) continue;
			if (!addedTitle) {
				html += "<h1>Uncategorised</h1>";
				addedTitle = true;
			}

			html += makeHTMLRepo(repo);
		}

		res.send(
			fs.readFileSync(global.__dirname+global.dir.public+"/git/index.html", "utf8")
				.replace(/\[repos\]/gi, html)
		)	
	});
});