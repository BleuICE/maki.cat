var request = require("request");

global.instagram = {
	count: 6, 
	api: "https://api.instagram.com/v1/users/self/media/recent/"+
	     "?access_token="+global.token.instagram+
	     "&count="+this.count,
	posts: [],
	get: function() {
		request({
			url: this.api,
			json: true
		}, function (err, res, body) {
			if (err) return global.log("Could not fetch Instagram!");
			
			global.instagram.posts = [];
			for (var i=0; i<global.instagram.count; i++) {
				global.instagram.posts.push({
					link: body["data"][i]["link"],
					url: body["data"][i]["images"]["standard_resolution"]["url"]
				});
			}

			global.log("Fetched Instagram posts");
		});
	}
}

global.instagram.get();
setInterval(function(){ global.instagram.get() }, 1000*60*60*48) // every 2 days