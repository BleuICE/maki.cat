var moment = require("moment")
var fs = require("fs")

global.app.get("/js", function(req, res) {
	let json = JSON.parse(fs.readFileSync("/home/max/maki.js/users.json"));	
	let html = fs.readFileSync(global.__dirname+global.dir.public+"/js/index.html", "utf8");
	
	let leaderboard = "";
	for (var i=0; i<Object.keys(json).length; i++) {
		let waifu = (json[Object.keys(json)[i]].waifu.username) ? json[Object.keys(json)[i]].waifu.username+" 💕" : "";
		
		// let coins = json[Object.keys(json)[i]].coins+"";
		// coins = (coins.length>4)? coins.slice(0, 4)+"...": coins;
		// 	coins="🔸 "+coins;

		leaderboard += "<tr>"+ 
			"<td><div class='avatar' style='background-image: url("+json[Object.keys(json)[i]].avatarURL+"?size=1)'></td>"+
			"<td>"+json[Object.keys(json)[i]].username+"</td>"+
			"<td>"+waifu+"</td>"+
			//"<td>Lvl. "+json[Object.keys(json)[i]].level+" ("+json[Object.keys(json)[i]].xp+"/1000)</td>"+
			"<td>Lvl. "+json[Object.keys(json)[i]].level+"</td>"+
			"<td>🔸 "+json[Object.keys(json)[i]].coins+"</td>"+
			"<td>"+moment.unix(json[Object.keys(json)[i]].created).format("Do MMM 'YY")+"</td>"
		"</tr>";
	}
		
	res.send(html
		.replace(/\[leaderboard\]/g, leaderboard)
		.replace(/\[total\]/g, Object.keys(json).length)
	);
});