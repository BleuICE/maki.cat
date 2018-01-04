for (var i=0; i<Object.keys(global.redirects).length; i++) {
	let redir = global.redirects[Object.keys(global.redirects)[i]];
	global.app.get("/"+Object.keys(global.redirects)[i], function(req, res) { res.redirect(redir); });
}