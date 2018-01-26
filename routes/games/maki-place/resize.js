var fs = require("fs");

var old_size = 512;
var old_board = JSON.parse(fs.readFileSync("./old.json"));

var new_size = 1024;
var new_board = [];

for (var y=0; y<new_size; y++) {
	for (var x=0; x<new_size; x++) {

		let p = x+(y*new_size);

		if (
			y < old_size && x < old_size
		) { // if its in
			new_board[p] = old_board[p-(y*(new_size-old_size))];
		} else {
			new_board[p] = 7;
		}

	}
}

fs.writeFileSync("./new.json", JSON.stringify(new_board));

console.log(old_board.length);
console.log(new_board.length);