global.app.use(function(req, res, next) {
	//fs.writeFileSync(dir.requests_log, fs.readFileSync(dir.requests_log, "utf8")+log+"\n");
	global.log((req.ip.split(":")[3])+" -> "+req.originalUrl);
    next();
});