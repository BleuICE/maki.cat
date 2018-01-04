module.exports = {
	domain: "maki.cat",

	redirects: {
		"steam": "https://steamcommunity.com/id/MakiXx",
		"twitter": "https://twitter.com/MakiXx_",
		"mail": "mailto:mxmcube@gmail.com?subject=Hey Maki!",
	},

	port: {
		http: 80,
		https: 443
	},

	dir: {
		stats: "/stats.json",
		log: "/requests.log",
		public: "/public"
	},

	token: {
		instagram: "",
		makiUpload: "",
		youtube: ""
	},

	secure: {
		cert: "",
		key: ""
	}
}