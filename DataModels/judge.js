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

function ActiveQuiz (quizId, name, users, questions, alt1, alt2, alt3, correct){
	this.quizId = quizId;
	this.name = name;
	this.users = users;
	this.questions = questions;
	this.alt1 = alt1;
	this.alt2 = alt2;
	this.alt3 = alt3;
	this.correct = correct;
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

		var activeQuiz = new ActiveQuiz(quiz.quizId, quiz.name, users, questions, alt1, alt2, alt3, correct);
		activeQuizzes.push(activeQuiz);

	})
}




