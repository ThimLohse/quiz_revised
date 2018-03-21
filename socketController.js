var quizList = require('./DataModels/quizRoom.js');
var activeQuiz = require('./DataModels/ActiveQuiz.js');

module.exports = function(socket, io) {
  

// Socket communication for the quiz list

  // For when a user enters the quizzes view, the user socket is added 
  // to the quizRoom sockt room so that updates to the room automatically
  // can be sent out to all the users currently in the view
  // IMPORTANT!!! the client application must call joinQuizRoom when entering the view
  socket.on('joinQuizList', function(req){
    socket.join('quizList');
  });

  // For when a user leaves the quizzes view
  socket.on('leaveQuizList', function(req){
    socket.leave('quizList');
  })

// Socket communication for the quiz room 

  // To set up the socket comunication for the quiz comunication
  socket.on('joinQuiz', function(req){
    // add the socket to the socket room for the quiz
    socket.join(req.quizId);
    // update the user list for quizList for corresponding quiz
    quizList.joinQuiz(req.quizId, req.user);
    var updatedQuizList = quizList.getQuizRoom();

    io.to('quizList').emit('updateQuizList', updatedQuizList);
  });

  socket.on('startQuiz', function(req){

    var quiz = quizList.getQuiz(req.quizId);

    quizList.startQuiz(quiz, req.userId);
    // Check how many has pressed quiz start, if every one is ready send out the first questions.
    if(activeQuiz.readyToStart(req.quizId)){
      io.to(req.quizId).emit('question', activeQuiz.nextQuestion(req.quizId));
    }

  });

  socket.on('answer', function(req){
    activeQuiz.userAnswer(req.quizId, req.userId, req.answer);
    if (activeQuiz.timeForNextQuestion(req.quizId)){
      io.to(req.quizId).emit('question', activeQuiz.nextQuestion(req.quizId));
    }
  })

};




/*module.exports = function (socket, io) {


  // user joins room
  socket.on('join', function (req) {
    console.log(req);
    var name = req.name;
    var user = req.user;
    var room = model.findRoom(name);
    // room.addUser(user);
    socket.join(name);
    console.log('A user joined ' + name);
    io.to(name).emit('join', req);
    //room.addMessage(req.username + " joined the channel");
  });
};*/ 