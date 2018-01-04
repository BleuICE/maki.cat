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

	client.dnsRecords.edit(
		global.token.cloudflare.zone,
		global.extra.polaristhicc.dns_id,
		{ 
			type: "A",
			name: global.extra.polaristhicc.record,
			content: req.query.ip 
		}
	).then(function(body) {
		if (body.success) {
			res.send("yay, you're done!! "+global.extra.polaristhicc.record+".maki.cat -> "+req.query.ip);
		} else {
			res.send("nuuuu, there was a problem...")
		}
	});

});