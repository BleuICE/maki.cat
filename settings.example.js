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

	places: {
		"public": {
			token: false,
			board_path: "public.json",
			save_interval: 2000,
			board_size: 512,
			public: {
				place_timeout: 800,
			}
		}
	},

	token: {
		instagram: "",
		makiUpload: "",
		youtube: "",
		cloudflare: {
			email: "",
			key: "",
			zone: ""
		}
	},

	secure: {
		cert: "",
		key: ""
	},

	extra: {
		polaristhicc: {
			token: "",
			dns_id: "",
			record: ""
		}	
	}
}