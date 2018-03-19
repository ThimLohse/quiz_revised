var express = require('express');
var app = express();
//var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
// Get the reference to the database, set up from inside the modules
var db = require("./dBmodels");
// Get the api routes
var apiRoutes = require("./routes/apiRoutes.js");
// Set up socket
var socket = require('socket.io');

app.use(express.static('./public'));

// For BodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

// Static files??
//app.use(express.static('app/public'));


/*app.get('/', function(req, res){
	res.send('Welcome to passport with Sequelize');
});*/

//Sync Database
db.sequelize.sync().then(function(){
	console.log('Nice, database looks fine!');
}).catch(function(err){
	console.log(err, "Something went wrong with the database update!");
})

// Initiate the api routes for the app and give it access to the database
apiRoutes(app, db);


var server = app.listen(5000, function(err){
	if(!err){
		console.log("Site is live");
	}else{
		console.log(err);
	}
});

//Socket setup
var io = socket(server);
var socketController = require("./socketController.js");
io.on('connection', function(socket){
	console.log('made socket connection');
	socketController(socket, io);
});
