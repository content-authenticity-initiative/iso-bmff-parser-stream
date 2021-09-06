var fs = require('fs');
var bmffParser = require('./parseStream.js');
var unflat = require('./lib/unflat.js');
var unbox = require('./lib/unbox.js');

// get the path to be processed
var myArgs = process.argv.slice(2);
// console.log('myArgs: ', myArgs);
var fName = myArgs[0];

try {
	var fileBuffArr = [];

	var fStream = fs.createReadStream(fName, {
		flags: 'r',
		encoding: null,
		fd: null,
		mode: 0666,
		autoClose: true
	});

	if ( false ) {	// OLD SCHOOL
		var unboxing = new bmffParser(function (err, data) {
			// pretty print the output at 4 spaces (null, 4)
			console.log(JSON.stringify(data, null, 4));
		});

		fStream
			.pipe(unboxing);
	} else {	// modern approach
		// An error occurred with the stream
		fStream.once('error', (err) => {
			// Be sure to handle this properly!
			console.error(err); 
		});

		// File is done being read
		fStream.once('end', () => {
			// create the final data Buffer from data chunks;
			fileBuffer = Buffer.concat(fileBuffArr);
			
			boxes = [];
			var boxFragment = unbox(fileBuffer, 0, boxes.push.bind(boxes));
			var outObj = unflat(boxes);
			console.log(JSON.stringify(outObj, null, 4));
		});

		// Data is flushed from fileStream in chunks,
		// this callback will be executed for each chunk
		fStream.on('data', (chunk) => {
			fileBuffArr.push(chunk); // push data chunk to array

			// We can perform actions on the partial data we have so far!
		});
	}
} catch (err) {
	console.error(err)
}
