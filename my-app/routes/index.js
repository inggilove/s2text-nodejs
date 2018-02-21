var fs = require('fs');
var path = require('path');
var moment = require('moment');

const speech = require('@google-cloud/speech');
const speechapi_projectId = 'gracechurch-home-1494138738759';
const speechapi_client = new speech.SpeechClient({
	  projectId: speechapi_projectId,
});
const speechapi_config = {
	  encoding: 'flac',
	  sampleRateHertz: 16000,
	  languageCode: 'ko-KR',
	  enableWordTimeOffsets: false
};

const gcsUriBase = "gs://my-audio/";
var gcsUri = gcsUriBase;
const speechapi_audio = {
	  uri: gcsUri,
};


module.exports = function(app, MyAudioScript)
{
    // GET ALL BOOKS
    app.get('/api/sample', function(req,res){
	MyAudioScript.find(function(err, scripts){
		if(err) return res.status(500).send({error: 'database failure'});
		res.json(scripts);
	})
    });
    // GET ALL BOOKS
    app.get('/api/showall', function(req,res){
	MyAudioScript.find(function(err, scripts){
		if(err) return res.status(500).send({error: 'database failure'});
		var result = JSON.parse( '{ "response": 200, "msg": "OK", "data": "" }');
		if ( scripts === null ) { result.msg = "Not Found in DB"; res.send(result); }
		
		console.log("scripts = " + scripts.length );

		var scr_a = new Array();
		for ( var inx in scripts ) {
			//console.log(inx + " title = " + scripts[inx].title);
			var scr_abs = item2summary( scripts[inx] );
			scr_a.push( scr_abs );
		}
		result.data = scr_a;
		//  {"response":200,"msg":"OK","data":[{"title":"Sample","date_created":"2018-01-30T08:05:10.351Z","elapsed":"00:00"}]
		//console.log("RESULT = " + JSON.stringify(result));
		res.send(result);
		//res.json(scripts);
	})

    });
    var item2summary = function ( script ) {
	var scr_abs = new Object();
	scr_abs.title = script.title;
	//scr_abs.url = script.url;
	scr_abs.date_created = moment( script.date_created ).format('YYYY-MM-DD HH:mm');
	try {
		var scr = JSON.parse( script.result );
		var stime = Number( scr.response.totalBilledTime.replace('s',''));
		if ( stime > 60 ) {
			scr_abs.elapsed = Math.floor(stime/60) + ":" + (stime % 60);
		} else {
			scr_abs.elapsed = "00:" + stime;
		}
	} catch(e) {
		scr_abs.elapsed = "00:00";
	}

    	return scr_abs;
    }

    // GET SINGLE BOOK
    app.get('/api/show/:title', function(req, res){
	MyAudioScript.findOneByTitle( req.params.title )
	.then((myscript) => {
		if (!myscript) return res.status(404).send({ err: req.params.title + ' - not found' });
		var result = JSON.parse( '{ "response": 200, "msg": "OK", "data": "" }');
		if ( myscript === null ) { result.msg = "Not Found in DB"; res.send(result); }
		var scr_abs = item2summary( myscript );
		
		var textResult = "";
		try {
			var scr = JSON.parse( myscript.result );
			//console.log( scr );
			//result += "response.results = " + JSON.stringify(scr.response.results[1])+ "\n";
			for ( var inx = 0; inx < scr.response.results.length; inx++ ) {
				textResult += " ("+inx+") " + scr.response.results[inx].alternatives[0].transcript + "\n";
				//result += scr.response.results[inx].alternatives[0].transcript + "\n";
			}
		} catch(e) { // direct data
			textResult = myscript.result;
		}
		scr_abs.script = textResult;
		result.data = scr_abs;
		//res.send("findOne successfully: " + result);
		// console.log("RESULT = " + JSON.stringify(result));
		res.send(result);
		//res.send("findOne successfully: " + myscript);
	})
	.catch(err => res.status(500).send(err));
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
    app.get('/api/addsample', function(req, res){
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
    app.get('/api/add/:gcsflacfile', function(req, res){
	let a_title = req.params.gcsflacfile.replace('/\s/g','');
	gcsUri = gcsUriBase + a_title;
	speechapi_audio.uri = gcsUri;
        const request = {
		  audio: speechapi_audio,
		  config: speechapi_config,
	};
	let transcription = '';
	let ret = {result: 0, msg: "OK"};
	console.log(gcsUri + " " + JSON.stringify(request));
	speechapi_client
	  .longRunningRecognize(request)
	  .then(data => {
	    console.log( "received one : " + JSON.stringify(data[0].latestResponse) );
	    const operation = data[0];
	    // Get a Promise representation of the final result of the job
	    return operation.promise();
	  })
	  .then(data => {
	    console.log( "received last : " + JSON.stringify(data[0].results) );
	    const response = data[0];
	    transcription = response.results
	      .map(result => result.alternatives[0].transcript)
	      .join('\n');
	    console.log(`Transcription: ${transcription}`);
	    // MongoDB  Save
		let myscript = new MyAudioScript();
		myscript.title = a_title;
		myscript.url = gcsUri;
		myscript.result = transcription; // direct data or {response: ... }
		myscript.date_created = new Date();
		
		myscript.save(function(err) {
		  if(err) {
			console.error(err);
	    		ret = {result: 400, msg: "Add Fail - " + a_title + " : " + err};
			//res.json({result: 0});
			//return;
		  }
		  ret = {result: 200, msg: "Add OK: " + a_title};
		  //res.json(ret);
		  //return;
		});
	    console.log( ret );
	  })
	  .catch(err => {
	    ret.msg = "Add Fail - " + a_title + " : " + err;
	    console.error('API ERROR: ', JSON.stringify(ret) + err);
	  });
	// ret = {result: 200, msg: "Add OK: " + a_title};
	res.json( ret );
	return;
    });
    app.get('/api/remove/:title', function(req, res){
	MyAudioScript.findOneByTitle( req.params.title ).remove().exec();
	console.log( "remove: " + req.params.title );
	res.json( { result: 1, msg: 'OK' } );
	return;
    });
    app.get('/api/addfile/:file', function(req, res){
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
