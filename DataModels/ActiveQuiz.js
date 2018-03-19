// The data model representing each quiz
"usestrict";

//Importe the database, for getting the questions for the quiz
var db = require('../dBmodels');

db.sequelize.sync().then(function(){
	console.log('Database was synced for quiz');
}).catch(function(err){
	console.log(err, 'The quiz model did not sync with the database');
})

var activeQuizzes = [];

function ActiveQuiz (quizId, name, users, questions, alt1, alt2, alt3, correct, nrQuestions){
	this.quizId = quizId;
	this.name = name;
	this.users = users;
	this.questions = questions;
	this.alt1 = alt1;
	this.alt2 = alt2;
	this.alt3 = alt3;
	this.correct = correct;
	this.nrQuestions = nrQuestions;
	// Variable to keep count on which question the quiz is on
	this.currentQuestion = 0;
	// Variable to keep count of how many of the players has answered
	this.answers = 0;
}

function User (userId) {
	this.userId = userId;
	this.score = 0;
}

// quiz is the Quiz object coming from the QuizRoom list
// the instance is used to create an actual quiz, with
// questions and answers.
exports.startQuiz = function(quiz){
	db.question.findAll({where: {quizId: quz.quizId}}).then(function(result){
		// Create new Quiz from the result and add it to activeQuizzes
		var length = result.length;
		var nrQuestions = length;
		var questions = [];
		var alt1 = [];
		var alt2 = [];
		var alt3 = [];
		var correct = [];
		// Add all questions with corresponding answers and alternatives
		for (var i = 0; i < length; i++){
			questions.push(result[i].question);
			alt1.push(result[i].alt1);
			alt2.push(result[i].alt2);
			alt3.push(result[i].alt3);
			correct.push(result[i].correct);
		}
		// Add all the users to the quiz in form of user objects
		length = quiz.users.length;
		var users = []
		for (var i = 0; i < length; i++) {
			var user = new User(quiz.users[i]);
			users.push(user);
		}

		var activeQuiz = new ActiveQuiz(quiz.quizId, quiz.name, users, questions, alt1, alt2, alt3, correct, nrQuestions);
		activeQuizzes.push(activeQuiz);

	})
}

// Returns the next question for the active game, should be called once from the socket module and broadcasted to 
// all clients assosialted with the socket for the active quiz
exports.nextQuestion = function(quizId){
	activeQuiz = getActiveQuiz(quizId);
	var currentQuestion = activeQuiz.currentQuestion;
	activeQuiz.currentQuestion ++;
	var nextQuestion = activeQuiz.questions[currentQuestion];

	return nextQuestion;
}

// The function will add points to a user if it did answer the current question correctly, for now 1 or 0 is returned
// the answer variable should be an integer 1-3 depending on which of the alternatives alt1, alt2, alt3 the user choose
exports.userAnswer = function(quizId, user, answer){
	var quiz = getActiveQuiz(quizId);
	var currentQuestion = quiz.currentQuestion;
	quiz.answers ++;
	if (answer == quiz.correct[currentQuestion]){
		var user = getUserInQuiz(quiz, user);
		user.score ++;
		return 1;
	}
	return 0;
}

// The socket module will check with this function to see when it is time to broadcast the next question
exports.timeForNextQuestion = function(){
	var quiz = getActiveQuiz(quizId);
	if (quiz.answers == quiz.users.length){
		quiz.answers = 0;
		return true;
	}
	return false;
}

// This function will register the results of the quiz to the database
exports.registerResults = function(quizId){
	var quiz = getActiveQuiz(quizId);
	var nrUsers = quiz.users;
	for(var i = 0; i < nrUsers; i++){
		db.results.findAll({where: {userId: quiz.users[i].userId} }).then(function(result){
			if(result.length > 0){ // exists, do a uppdate
				var totScore = result[0].points;
				db.results.update(
   					{points: totScore},
   					{where: {userId: quiz.users[i].userId}}
 					);	
			}else{ // does not exist in database create a new one
				db.results.create({
					userId: quiz.users[i].userId,
					points: quiz.users[i].score,
				});
			} 
		});
	}
}

/*
db.user.create({
			username: req.body.user,
			password: req.body.pwd
		}).then(function(result){
			//res.json(req.body);
			res.json({success: true});
		});
*/

/*
db.user.findAll({where: {username: req.body.user, password: req.body.pwd}}).then(function(result){
			if(result.length > 0){
				res.json({success: true});
			}else{
				res.json({success: false});
			}
		});
*/

/*
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
*/

function getActiveQuiz(quizId){
	var length = activeQuizzes.length;
	for(var i = 0; i < length; i++){
		if(activeQuizzes[i].quizId = quizId){
			return activeQuizzes[i];
		}
	}
}

function getUserInQuiz(quiz, user){
	var length = quiz.users.length;
	for(var i = 0; i < length; i++){
		if(quiz.users[i].userId = quizId){
			return quiz.users[i];
		}
	}
}



