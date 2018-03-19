module.exports = function(socket, io) {
  
  // For when a user enters the quizzes view, the user socket is added 
  // to the quizRoom sockt room so that updates to the room automatically
  // can be sent out to all the users currently in the view
  // IMPORTANT!!! the client application must call joinQuizRoom when entering the view
  socket.on('joinQuizRoom', function(req){
    socket.join('quizRoom');
  });

  // For when a user leaves the quizzes view
  socket.on('leaveQuizRoom', function(req){
    socket.leave('quizRoom');
  })

  // To set up the socket comunication for the quiz comunication
  socket.on('joinQuiz', function(req){

  });

  socket.on('quizAnswer', function(req){

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