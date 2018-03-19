var request = require("request");

global.app.get("/discord-message", function(req, res) {
	if (!req.query.to) { res.send("You didn't specify who you want to send it to."); return; }
	if (!Object.keys(global.discord_message.people).includes(req.query.to)) {
		res.send("Person not found."); return; }
	if (!req.query.name) { res.send("You didn't specify a name."); return; }
	if (!req.query.message) { res.send("You didn't specify a message."); return; }

	request({
		url: global.discord_message.url,
		qs: {
			id: global.discord_message.people[req.query.to],
			ip: req.connection.remoteAddress.split(":")[3],
			name: req.query.name,
			message: req.query.message
		}
	}, function(err, r_res, body) {
		res.send(body);
	});
});

// global.message_users

// if (!req.query.name) res.send("You didn't specify a name.");
// if (!req.query.message) res.send("You didn't specify a message.");