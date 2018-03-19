
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
	app.post('/api/signup', function(req, res) {
		console.log(req.body);
		db.user.create({
			username: req.body.user,
			password: req.body.pwd
		}).then(function(result){
			res.json(req.body);
		});
	});
	// Sign in a user
	app.post('/api/signin', function(req, res) {
		db.user.findAll({where: {username: req.body.user, password: req.body.pwd}}).then(function(result){
			if(result.length > 0){
				res.json({success: true});
			}else{
				res.json({success: false});
			}
		});
	});

	// Get all the quizes for the quiz room
	app.get('/api/quizRoom', function(req, res) {
		var quizzes = quizRoom.getQuizRoom();
		res.json(quizzes);
	});
}