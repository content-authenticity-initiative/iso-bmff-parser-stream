var fs = require('fs');
var bmffParser = require('./parseStream.js');

// get the path to be processed
var myArgs = process.argv.slice(2);
// console.log('myArgs: ', myArgs);
var fName = myArgs[0];

try {
	var fStream = fs.createReadStream(fName, {
		flags: 'r',
		encoding: null,
		fd: null,
		mode: 0666,
		autoClose: true
	});

	var unboxing = new bmffParser(function (err, data) {
		// pretty print the output at 4 spaces (null, 4)
		console.log(JSON.stringify(data, null, 4));
	});

	fStream
		.pipe(unboxing);
} catch (err) {
	console.error(err)
}
