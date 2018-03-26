// the data model for the quiz rooms
"usestrict";

// Import the database
var db = require('../dBmodels');

var QuizRoom = [];//"quizzzzzz roooom !!!!!!";

db.sequelize.sync().then(function(){
	console.log('Database loded in quizroom');

	db.quiz.findAll({/*where*/}).then(function(result){
		//console.log(result);
		//console.log(QuizRoom);
		QuizRoom = createQizRoom(result)
		console.log(QuizRoom);
	});

}).catch(function(err){
	console.log(err, 'The quizRoom model did not sync the database');
})


// Populate the QuizRoom with the data from the quiz table in the database



function Quiz (name, quizId, level, genre){
	this.quizId = quizId;
	this.name = name;
	this.level = level;
	this.genre = genre;
	this.users = []; // Will be a list of Users 
	this.playing = false;


}

function User (userId){
	this.userId = userId;
	this.ready = false;
}

exports.getUsersForQuiz = function(quizId){
	var quiz = getQuiz(quizId);
	var l = quiz.users.length;
	var userList = [];
	for (var i = 0; i < l; i++){
		var user = quiz.users[i];
		userList.push({userId: user.userId});
	}
	return {users: userList};
}

exports.getQuizRoom = function(){
	return QuizRoom;
} 

exports.startQuiz = function(quizId){
	var length = QuizRoom.length;
	for (var i = 0; i < length; i++){
		if (QuizRoom[i].quizId == quizId){
			QuizRoom[i].playing = true;
		}
	}
}

exports.quizEnded = function(id){
	var length = QuizRoom.length;
	for (var i = 0; i < length; i++){
		if (QuizRoom[i].quizId == id){
			QuizRoom[i].playing = false;
			QuizRoom[i].users = [];
		}
	}
}

function getQuiz(quizId){
	console.log(QuizRoom)
	var length = QuizRoom.length;
	for(var i = 0; i < length; i++){
		console.log(QuizRoom[i].quizId)
		if (QuizRoom[i].quizId == quizId){
			return QuizRoom[i];
		}
	}
}

exports.getQuiz = function(quizId){
	console.log(QuizRoom)
	var length = QuizRoom.length;
	for(var i = 0; i < length; i++){
		console.log(QuizRoom[i].quizId)
		if (QuizRoom[i].quizId == quizId){
			return QuizRoom[i];
		}
	}
}

exports.joinQuiz = function(id, userId){
	var length = QuizRoom.length;
	for (var i = 0; i < length; i++){
		if (QuizRoom[i].quizId == id){
			var user = new User(userId);
			QuizRoom[i].users.push(user);
		}
	}
}


function createQizRoom(result){
	var length = result.length;
	var list = [];
	var q;
	var quiz;
	for (var i = 0; i < length; i++){
		q = result[i];
		quiz = new Quiz(q.name, q.id, q.level, q.genre);
		list.push(quiz);
	}
	return list;
}


function loadQuizFormDB(db){
	db.quiz.findAll({/*where*/}).then(function(result){
		console.log(result);
	});
}