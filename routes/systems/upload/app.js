var bodyParser = require("body-parser");
var multer = require("multer");
var moment = require("moment");
var fs = require("fs");

global.app.use(bodyParser.json());
global.app.use(bodyParser.urlencoded({extended: true})); 

var upload = {
	token: global.token.upload,
	length: 6,
	domain: "https://maki.cat",
	dest: global.__dirname+global.dir.public+"/u",
	folder: "/u",
	multer: multer(),
}

function genB64(len) {
	let dick = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
	let tionary=""; for (let x=0; x<len; x++) { tionary+=dick[Math.floor(Math.random()*dick.length)]; }
	return tionary;
}

function genName(filetype) {
	let name = genB64(upload.length)+"."+filetype;
	let path = upload.dest+"/"+name;
	if (fs.existsSync(path)) {
		return genName(filetype);
	} else { return name; }
}

global.app.post("/api/upload", upload.multer.array("files"), function(req, res) {
	console.log(req.body);
	if (req.body.token != upload.token) { res.send("Invalid token!"); return; }
	if (req.files.length <= 0) { res.send("No files received!"); return; }

	let json = []
	for (let x=0; x<req.files.length; x++) {
		let filetype = req.files[x].originalname.split(".")[req.files[x].originalname.split(".").length-1];
		let name = genName(filetype);
		fs.writeFileSync(upload.dest+"/"+name, req.files[x].buffer);
		json.push(upload.domain+upload.folder+"/"+name)
		global.log("Maki Upload: "+req.ip.substring(7)+"; files="+req.files.length+"; "+name);
	}
	res.json(json);
});

// global.app.post(upload.post.files, upload.upload.array("files"), function(req, res) {
// 	if (req.body.token != upload.token) { res.send("Invalid token!"); return; }

// 	fs.readdir(upload.dest, function(err, files) {
// 		data = files
// 			.filter(val=>val !=="index.html")
// 			.filter(val=>val !=="sharex")
// 			.filter(val=>val !=="stats")
// 			.filter(val=>val !=="faq");

// 		res.json({
// 			amount: data.length,
// 			files: data
// 		});
// 	});
// });

function addPage(path, page) {
	global.app.get(upload.folder+path, function(req, res) {
		let html = fs.readFileSync(__dirname+"/page.html", "utf8")
			.replace(/\[content\]/g, fs.readFileSync(__dirname+"/"+page+".html", "utf8"));
		res.send(html);
	});
}

addPage("", "home");
addPage("/scripts", "scripts");
addPage("/faq", "faq");

//files