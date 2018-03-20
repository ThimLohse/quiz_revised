
var quizRoom = require('../DataModels/quizRoom.js');

module.exports = function(app, db) {
	// Test code to show all users in database
	app.get('/api/all', function(req, res) {
		db.user.findAll({/*where*/}).then(function(result){
			console.log("running api all !!!!!!!!!!!!!!");
			console.log(result);
			res.json(result);
		});
	});
	// Sign up a new user
	/*app.post('/api/signup', function(req, res) {
		console.log(req.body);
		db.user.create({
			username: req.body.user,
			password: req.body.pwd
		}).then(function(result){
			res.json(req.body);
		});
	});*/

	/*app.post('/api/signup', function(req, res) {
		console.log('signing up!!!');
		console.log(req.body);
		db.user.create({
			username: req.body.user,
			password: req.body.pwd
		}).then(function(result){
			//res.json(req.body);
			res.json({success: true});
		});
	});*/

	
	app.post('/api/signup', function(req, res){
		console.log('New user might be made!!!');
		db.user.findOrCreate({
	      where: {
	        username: req.body.user
	      },
	      defaults: { // set the default properties if it doesn't exist
	        password: req.body.pwd
	      }
	    }).then(function(result) {
	      var author = result[0], // the instance of the author
	        created = result[1]; // boolean stating if it was created or not

	      if (created) {
	        console.log('Author already exists');
	        res.json({success: true});
	      }else{
	      	console.log('Created author...');
	      	res.json({success: false});
	      }
	    });
	});
	
	// Sign in a user
	app.post('/api/signin', function(req, res) {
		db.user.findAll({where: {username: req.body.user, password: req.body.pwd}}).then(function(result){
			if(result.length > 0){
				res.json({success: true, userId: req.body.user});
			}else{
				res.json({success: false});
			}
		});
	});

	// Get all the quizes for the quiz room
	app.get('/api/quizList', function(req, res) {
		var quizzes = quizRoom.getQuizRoom();
		res.json(quizzes);
	});
}