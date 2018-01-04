global.app.use(function(req, res, next) {
	//fs.writeFileSync(log_dir, fs.readFileSync(log_dir, "utf8")+log+"\n");
	global.log((req.ip.split(":")[3])+" -> "+req.originalUrl);
    next();
});