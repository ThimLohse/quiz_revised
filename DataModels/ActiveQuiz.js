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
	// To check when everybody is ready to start
	this.ready = 0
}

function User (userId) {
	this.userId = userId;
	this.score = 0;
	this.ready = false;
}

exports.readyToSendFirstQuestion = function(quizId){
	var quiz = getActiveQuiz(quizId);
	if (quiz.ready == quiz.users.length){
		return true
	}else{
		quiz.ready += 1
		return false
	}
}


exports.readyToStartQuiz = function(quizId){
	var quiz = getActiveQuiz(quizId);
	/*console.log('fhdskh');
	console.log(quiz);
	console.log('fhdskh')*/
	var length = quiz.users.length;
	for(var i = 0; i < length; i++){
		if (!quiz.users[i].ready){
			return false;
		}
	}
	return true;
}

exports.readyForNextQuestion = function(quizId){
	var quiz = getActiveQuiz(quizId);
	/*console.log('fhdskh');
	console.log(quiz);
	console.log('fhdskh')*/
	var length = quiz.users.length;
	for(var i = 0; i < length; i++){
		if (!quiz.users[i].ready){
			return false;
		}
	}
	return true;
}

exports.userIsReady = function(quizId, userId){
	var quiz = getActiveQuiz(quizId);
	var user = getUserInQuiz(quiz, userId);
	user.ready = true;
}

exports.toggleUsersReady = function(quizId){
	var quiz = getActiveQuiz(quizId);
	var l = quiz.users.length;
	for (var i = 0; i < l; i++){
		quiz.users[i].ready = false;
	}
	quiz.answers = 0;
}

// Returns if the user has answered or not
exports.userHasAnswerd = function(quizId, userId){
	var quiz = getActiveQuiz(quizId);
	var user = getUserInQuiz(quiz, userId);
	return user.ready;
}

// Used to send the list of all users who has answered
exports.getUsersWhoHasAnswered = function(quizId){
	var listOfUsers = [];
	var quiz = getActiveQuiz(quizId);
	var l = quiz.users.length;
	for (var i = 0; i < l; i++){
		if (quiz.users[i].ready == true){
			var userName = quiz.users[i].userId;
			listOfUsers.push({userId: userName});
		}
	}
	return {users: listOfUsers};
	//return listOfUsers
}

// quiz is the Quiz object coming from the QuizRoom list
// the instance is used to create an actual quiz, with
// questions and answers.
exports.startQuiz = function(quiz, userId, io){
	var quizId = quiz.quizId;
	console.log("new quiz");

	console.log("create new quiz");
	db.questions.findAll({where: {quizId: quiz.quizId}}).then(function(result){
		// Create new Quiz from the result and add it to activeQuizzes
		console.log("created new quiz1");
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
			correct.push(result[i].corect);
		}
		// Add all the users to the quiz in form of user objects
		length = quiz.users.length;
		var users = [];
		for (var i = 0; i < length; i++) {
			var user = new User(quiz.users[i].userId);
			if (quiz.users[i].userId == userId){
				console.log('found user!');
				user.ready = true;
			}
			users.push(user);
		}

		var activeQuiz = new ActiveQuiz(quiz.quizId, quiz.name, users, questions, alt1, alt2, alt3, correct, nrQuestions);
		console.log("created new quiz");
		activeQuizzes.push(activeQuiz);

		var length = activeQuiz.users.length;
		var start = true
		for(var i = 0; i < length; i++){
			if (!activeQuiz.users[i].ready){
				start = false;
			}
		}

		if(start){
			// Toggle the ready state for the single user of the quiz, there will only be one user in the quiz if start
			// would be true
			activeQuiz.users[0].ready = false;

			console.log('game should start and send fucking answer');
			var currentQuestion = activeQuiz.currentQuestion;
			activeQuiz.currentQuestion ++;
			var nextQuestion = activeQuiz.questions[currentQuestion];
			var nextAlt1 = activeQuiz.alt1[currentQuestion];
			var nextAlt2 = activeQuiz.alt2[currentQuestion];
			var nextAlt3 = activeQuiz.alt3[currentQuestion];

			var data  = {question: nextQuestion, alt1: nextAlt1, alt2: nextAlt2, alt3: nextAlt3};
			console.log(data);
			io.to(activeQuiz.quizId).emit('question', data);
		}
	});
	
	/*
	var user = getUserInQuiz(quiz, userId);
	user.ready = true;

	console.log(activeQuizzes)
	*/
}

exports.getResultsForQuiz = function(quizId){
	activeQuiz = getActiveQuiz(quizId);
	results = [];
	var length = activeQuiz.users.length;
	for (var i = 0; i < length; i++){
		var user = activeQuiz.users[i].userId;
		var score = activeQuiz.users[i].score;
		var res = {user: user, score: score};
		results.push(res);
	}
	// Sort the results before returning the list
	results.sort(compareIndexFound);
	endActiveQuiz(quizId);
	return {resultList: results};
}

// Help function for sorting the results
function compareIndexFound(a, b) {
  if (a.score < b.score) { return 1; }
  if (a.score > b.score) { return -1; }
  return 0;
}

function endActiveQuiz(quizId){
	var length = activeQuizzes.length;
	for(var i = 0; i < length; i++){

		if(activeQuizzes[i].quizId == quizId){
			// Remove this quiz
			activeQuizzes.splice(i,1);
		}
	}
}

exports.getActiveQuiz = function(quizId){
	/*console.log('fhdsksvaddvah');
	console.log(activeQuizzes);
	console.log('fhdskhdva');*/
	var length = activeQuizzes.length;
	for(var i = 0; i < length; i++){
		console.log('fhdskhdva');
		console.log(activeQuizzes[i].quizId);
		console.log('fhdskhdva');
		if(activeQuizzes[i].quizId == quizId){
			return activeQuizzes[i];
		}
	}
	// Returns true is the quiz can not be found 
	return true;
}

function getActiveQuiz(quizId){
	/*console.log('fhdsksvaddvah');
	console.log(activeQuizzes);
	console.log('fhdskhdva');*/
	var length = activeQuizzes.length;
	for(var i = 0; i < length; i++){
		console.log('fhdskhdva');
		console.log(activeQuizzes[i].quizId);
		console.log('fhdskhdva');
		if(activeQuizzes[i].quizId == quizId){
			return activeQuizzes[i];
		}
	}
	// Returns true is the quiz can not be found 
	return true;
}

exports.endOfGame = function(quizId){
	activeQuiz = getActiveQuiz(quizId);
	//console.log('activeQuiz end of gamr?');
	//console.log(activeQuiz);
	console.log(activeQuiz.currentQuestion);
	console.log(activeQuiz.nrQuestions);
	if (activeQuiz.currentQuestion == activeQuiz.nrQuestions){
		return true;
	}
	return false;
}

// Returns the next question for the active game, should be called once from the socket module and broadcasted to 
// all clients assosialted with the socket for the active quiz
exports.nextQuestion = function(quizId){
	activeQuiz = getActiveQuiz(quizId);
	console.log('activeQuiz');
	console.log(activeQuiz);
	var currentQuestion = activeQuiz.currentQuestion;
	activeQuiz.currentQuestion ++;
	var nextQuestion = activeQuiz.questions[currentQuestion];
	var nextAlt1 = activeQuiz.alt1[currentQuestion];
	var nextAlt2 = activeQuiz.alt2[currentQuestion];
	var nextAlt3 = activeQuiz.alt3[currentQuestion];

	var data  = {question: nextQuestion, alt1: nextAlt1, alt2: nextAlt2, alt3: nextAlt3};

	return data;
}

// The function will add points to a user if it did answer the current question correctly, for now 1 or 0 is returned
// the answer variable should be an integer 1-3 depending on which of the alternatives alt1, alt2, alt3 the user choose
exports.userAnswer = function(quizId, user, answer){
	console.log('fadsffadd');
	console.log(activeQuizzes);
	console.log('afdfaf');
	var quiz = getActiveQuiz(quizId);
	var currentQuestion = quiz.currentQuestion;
	if (answer == quiz.correct[currentQuestion-1]){
		quiz.answers ++;
		var user = getUserInQuiz(quiz, user);
		//user.score ++;
		// Simple implementation to reduce points for the players who answers late
		user.score += 1/(quiz.answers);
		return 1;
	}
	return 0;
}

// The socket module will check with this function to see when it is time to broadcast the next question
exports.timeForNextQuestion = function(quizId){
	var quiz = getActiveQuiz(quizId);
	if (quiz.answers == quiz.users.length){
		quiz.answers = 0;
		return true;
	}
	return false;
}

function addResult(user, quizId, score){
	db.results.findAll({where: {userId: user, quizId: quizId} }).then(function(result){
			console.log('in the fucking function');
			/*if(result.length > 0){ // exists, do an uppdate
				console.log('making uppdate to results');
				var totScore = result[0].points + score;
				db.results.update(
   					{points: totScore},
   					{where: {userId: user, quizId: quizId}}
 					);	
			}else{*/ // does not exist in database create a new one
				console.log('creating new results');
				db.results.create({
					quizId: quizId,
					userId: user,
					points: score,
				});
			/*}*/ 
		});
}

// This function will register the results of the quiz to the database
exports.registerResults = function(quizId){

	var quiz = getActiveQuiz(quizId);
	var nrUsers = quiz.users.length;
	console.log('in results');
	console.log(quiz);
	console.log(nrUsers);
	var user = ''
	score = 0
	for(var i = 0; i < nrUsers; i++){
		user = quiz.users[i].userId
		score = quiz.users[i].score
		console.log(user);
		addResult(user, quizId, score)
	}
}




function getUserInQuiz(quiz, userId){
	var length = quiz.users.length;
	for(var i = 0; i < length; i++){
		//console.log(quiz.users[i]);
		if(quiz.users[i].userId == userId){
			return quiz.users[i];
		}
	}
}



