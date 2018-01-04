global.app.get("*", function(req, res){
	res.sendFile(global.__dirname+global.dir.public+"/error.html", 404);
});
