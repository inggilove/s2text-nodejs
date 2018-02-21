var fs = require('fs');
var path = require('path');

module.exports = function(app, MyAudioScript)
{
    // GET ALL BOOKS
    app.get('/api/scripts', function(req,res){
	MyAudioScript.find(function(err, scripts){
		if(err) return res.status(500).send({error: 'database failure'});
		res.json(scripts);
	})
    });

    // GET SINGLE BOOK
    app.get('/api/s/:title', function(req, res){
	var cursor = MyAudioScript.find({title: req.params.title});
	    console.log( "cursor = " + cursor );
	var output;
	while (cursor.hasNext()) {
		output += cursor.next();
		printjson(cursor.next());
	}
	res.send( output );
	    /*
	MyAudioScript.find({title: req.params.title}).toArray(function(err, docs) {
		if (err) throw err;
		res.send( docs );
		for (i = 0; i<docs.length; i++) {
			console.log("totalBilledTime = " +docs[i].totalBilledTime);
			console.log(docs[i].transcript);
		}
	})
	    */
    });

    // CREATE BOOK
    app.get('/api/sample', function(req, res){
	var myscript = new MyAudioScript();
	myscript.title = "Sample";
	myscript.date_created = new Date();
	
	myscript.save(function(err) {
		if(err) {
			console.error(err);
			res.json({result: 0});
			return;
		}
	res.json({result: 1});
	});
    });
    app.get('/api/file/:file', function(req, res){
	var fileName = path.resolve(__dirname + "/../static", req.params.file);
	console.log(fileName);
	var text = fs.readFileSync( fileName, 'utf8');
	//console.log(text);

	var myscript = new MyAudioScript();
	myscript.title = req.params.file;
	myscript.url = fileName;
	myscript.result = text;
	myscript.date_created = new Date();
	
	myscript.save(function(err) {
		if(err) {
			console.error(err);
			res.json({result: 0});
			return;
		}
	res.json({result: 1});
	});
    });
}
