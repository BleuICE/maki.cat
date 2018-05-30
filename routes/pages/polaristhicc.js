var client = require('cloudflare')({
	email: global.token.cloudflare.email,
	key: global.token.cloudflare.key
});

global.app.get("/polaristhicc", function (req, res) {

	if (req.query.token != global.extra.polaristhicc.token) {
		res.send("gtfo here you lil' hackeerrr");
		return;
	}

	if (req.query.ip == undefined || req.query.ip == "") {
		res.send("hii!!! you forgot &ip= at the end!!!");
		return;
	}


	client.dnsRecords.browse(global.token.cloudflare.zone).then(records => {
		for (var i=0; i<records.result.length; i++) {
			let record = records.result[i];
			if (record.name != global.extra.polaristhicc.record) continue;

			global.log(global.extra.polaristhicc.record+" found with ID: "+record.id);

			record.content = req.query.ip;

			client.dnsRecords.edit(
				global.token.cloudflare.zone, record.id, record
			).then(function(body) {
				if (body.success) {
					res.send("yay, you're done!! "+global.extra.polaristhicc.record+".maki.cat -> "+req.query.ip);
				} else {
					res.send("nuuuu, there was a problem...")
				}
			}).catch(function(err) {
				console.log(err);
				res.send("nuuuu, there was a problem...");
			});

			return;
		}
		res.send("nuuuu, there was a problem...");
	});
});