var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var cors    = require('cors');

var swaggerTools = require('swagger-tools');
var YAML = require('yamljs');
var swaggerDoc = YAML.load('openapi.yaml');


// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(cors());

// [CONFIGURE SERVER PORT]
//var port = process.env.PORT || 3000;
var port = process.env.PORT || 3000;

// [CONFIGURE ROUTER]
var MyAudioScript = require('./models/AudioScript');
var router = require('./routes')(app, MyAudioScript);

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
	// CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://172.17.0.3:27017/myAudio');

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
	// Serve the Swagger documents and Swagger UI
	app.use(middleware.swaggerUi());
});

//app.use('/audio', require('./routes/audios'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.get('/echo/:mypara', function (req, res) {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.json({result: 0, msg: "url = "+fullUrl});
});

app.get('/file', function(req, res){
	  var file = __dirname + '/static/sermon-main-2018-0128.txt';
	  res.download(file); // Set disposition and send it.
});

app.listen(port, function () {
  console.log('audio app listening on port ' + port);
});
