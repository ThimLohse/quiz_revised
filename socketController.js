var quizList = require('./DataModels/quizRoom.js');
var activeQuiz = require('./DataModels/ActiveQuiz.js');

module.exports = function(socket, io) {
  

// Socket communication for the quiz list

  // For when a user enters the quizzes view, the user socket is added 
  // to the quizRoom sockt room so that updates to the room automatically
  // can be sent out to all the users currently in the view
  // IMPORTANT!!! the client application must call joinQuizRoom when entering the view
  socket.on('joinQuizList', function(req){
    console.log('New browser joins the quizList');
    socket.join('quizList');
    
    //var updatedQuizList = quizList.getQuizRoom();
    //io.to('quizList').emit('updateQuizList', updatedQuizList);
  });

  // For when a user leaves the quizzes view
  socket.on('leaveQuizList', function(req){
    console.log('User leavs quizList');
    socket.leave('quizList');
  })

// Socket communication for the quiz room 

  // To set up the socket comunication for the quiz comunication
  socket.on('joinQuiz', function(req){
    // add the socket to the socket room for the quiz
    socket.join(req.quizId);
    // update the user list for quizList for corresponding quiz

    // Need to get a user id in response, not getting a user id at the moment
    console.log("user id for user joining quiz");
    console.log(req.user);
    quizList.joinQuiz(req.quizId, req.user);
    var updatedQuizList = quizList.getQuizRoom();

    console.log('User joins quiz');
    console.log(updatedQuizList);
    io.to('quizList').emit('updateQuizList', updatedQuizList);

    var data = quizList.getUsersForQuiz(req.quizId);
    console.log(data);
    io.to(req.quizId).emit('userJoined', data);
  });

  socket.on('startQuiz', function(req){

    console.log('User wants to start a new quiz');

    // Make playing = true in the quizList
    quizList.startQuiz(req.quizId);
    var updatedQuizList = quizList.getQuizRoom();
    io.to('quizList').emit('updateQuizList', updatedQuizList);



    // Check if the active quiz has been created
    console.log(activeQuiz.getActiveQuiz('Active quizzzzz!!!!!!!'));
    console.log(activeQuiz.getActiveQuiz(req.quizId));

    // A new active quiz should be created
    if (activeQuiz.getActiveQuiz(req.quizId) === true){
      var quiz = quizList.getQuiz(req.quizId);
      console.log('the current user is');
      console.log(req.user);
      activeQuiz.startQuiz(quiz, req.user, io);
    }else{ // The active quiz already exists but has not yet started since all users are not ready yet
      // Indicate that the user is ready to play
      activeQuiz.userIsReady(req.quizId, req.user);
      if(activeQuiz.readyToStartQuiz(req.quizId)){
        // Change toggle all user.ready to false
        activeQuiz.toggleUsersReady(req.quizId);
        // Send out the question to all the users
        io.to(req.quizId).emit('question', activeQuiz.nextQuestion(req.quizId));
      }
    }

  });

  socket.on('userJoined', function(req){
    var data = quizList.getUsersForQuiz(req.quizId);
    console.log(data);
    io.to(req.quizId).emit('userJoined', data);
  })


  socket.on('answer', function(req){

    console.log('User has an answer');
    // Register the answer from the user if ready = false -> user has not yet answered
    console.log('The user is answering ! ! 1 1 1 1! 1! !')
    console.log('quizId: ' + req.quizId + ' userId: ' + req.userId)
    if (!activeQuiz.userHasAnswerd(req.quizId, req.userId)){
      activeQuiz.userAnswer(req.quizId, req.userId, req.answer);
      // Change the sytate of the user so it can not answer more times on the same question
      activeQuiz.userIsReady(req.quizId, req.userId);
      // Send out a uppdate that the user has answered
      var data = activeQuiz.getUsersWhoHasAnswered(req.quizId);

      console.log("new list of users who has answered " + data);

      io.to(req.quizId).emit('userAnswered', data); // ----------------- Implement on client side -----------------

    }else{
      console.log(req.user + ' Sent an answer but has already answered FFS!!!');
    }

    // All the users has toggeled to ready = true
    if (activeQuiz.readyForNextQuestion(req.quizId)){

      // Check if this was the last question, in such case show results, else emit next question
      if (activeQuiz.endOfGame(req.quizId)){
        console.log('register results');
        activeQuiz.registerResults(req.quizId);

        // The results should be emitted to the client
        var results = activeQuiz.getResultsForQuiz(req.quizId);
        console.log('results');
        console.log(results);
        io.to(req.quizId).emit('gameOver', results);

        // Make the quiz appare as playable in the quiz list
        quizList.quizEnded(req.quizId);
        // Send out quizRoom change
        var updatedQuizList = quizList.getQuizRoom();
        io.to('quizList').emit('updateQuizList', updatedQuizList);


      }else{

      // Change toggle all user.ready to false
      activeQuiz.toggleUsersReady(req.quizId);

      // Emit the next question to all the users
        console.log('Time for a new question');
        var data = activeQuiz.nextQuestion(req.quizId);
        console.log(data);
        io.to(req.quizId).emit('question', data); 
      }
    }
  });

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