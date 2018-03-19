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
	this.users = [];
	this.playing = false;


}

exports.getQuizRoom = function(){
	return QuizRoom;
} 

exports.quizPlaying = function(id){
	var length = QuizRoom.length;
	for (var i = 0; i < length; i++){
		if (QuizRoom[i].quizId == id){
			QuizRoom[i].playing = true;
		}
	}
}

exports.quizEnded = function(id){
	var length = QuizRoom.length;
	for (var i = 0; i < length; i++){
		if (QuizRoom[i].quizId == id){
			QuizRoom[i].playing = false;
		}
	}
}

exports.joinQuiz = function(id, user){
	var length = QuizRoom.length;
	for (var i = 0; i < length; i++){
		if (QuizRoom[i].quizId == id){
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