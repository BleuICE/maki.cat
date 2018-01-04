var bodyParser = require("body-parser");
var multer = require("multer");
var moment = require("moment");
var fs = require("fs");

global.app.use(bodyParser.json());
global.app.use(bodyParser.urlencoded({extended: true})); 

var makiUpload = {
	token: global.token.makiUpload,
	length: 6,
	domain: "https://maki.cat",
	dest: global.__dirname+global.dir.public+"/u",
	folder: "/u",
	upload: multer(),
	html: global.__dirname+global.dir.public+"/u/index.html",
	post: {
		upload: "/api/upload",
		files: "/api/files"
	}
}

function genB64(len) {
	let dick = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
	let tionary=""; for (let x=0; x<len; x++) { tionary+=dick[Math.floor(Math.random()*dick.length)]; }
	return tionary;
}

function genName(filetype, override) {
	let name = genB64(makiUpload.length)+"."+filetype;
	let path = makiUpload.dest+"/"+name;
	if (fs.existsSync(path)) return genName(filetype, true);
	return name;
}

global.app.post(makiUpload.post.upload, makiUpload.upload.array("files"), function(req, res) {
	if (req.body.token != makiUpload.token) { res.send("Invalid token!"); return; }
	if (req.files.length <= 0) { res.send("No files received!"); return; }

	let json = []
	for (let x=0; x<req.files.length; x++) {
		let filetype = req.files[x].originalname.split(".")[req.files[x].originalname.split(".").length-1];
		let name = genName(filetype);
		fs.writeFileSync(makiUpload.dest+"/"+name, req.files[x].buffer);
		json.push(makiUpload.domain+makiUpload.folder+"/"+name)
		global.log("Maki Upload: "+req.ip.substring(7)+"; files="+req.files.length+"; "+name);
	}
	res.json(json);
});

global.app.post(makiUpload.post.files, makiUpload.upload.array("files"), function(req, res) {
	if (req.body.token != makiUpload.token) { res.send("Invalid token!"); return; }

	fs.readdir(makiUpload.dest, function(err, files) {
		data = files
			.filter(val=>val !=="index.html")
			.filter(val=>val !=="sharex")
			.filter(val=>val !=="stats")
			.filter(val=>val !=="faq");

		res.json({
			amount: data.length,
			files: data
		});
	});
});