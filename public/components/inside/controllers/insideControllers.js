'use strict'
//Open up socket connection. This is used for socket communication with the server
var socket = io();

angular.module('quiz').controller('insideNavCtrl', function($scope, $log, $state) {

  $scope.logout = function() {
    $state.go('app.outside.navbar.home');
  };

});
angular.module('quiz').controller('dashboardCtrl', function($scope, $log) {});
angular.module('quiz').controller('quizListCtrl', function($rootScope, $state, $scope, $log, $http) {

  //Mock data
  $scope.results = [
    {
      'name': 'quiz1',
      'users': ['kalle, niklas, tomas'],
      'playing': true,
      'quizId': 'quiz1'
    }, {
      'name': 'quiz2',
      'users': ['kalle, niklas, tomas'],
      'playing': false,
      'quizId': 'quiz2'
    }
  ];
  //Get the list the first time
  $http.get('/api/quizList').then(function(response) {

    //Fetch all the quizrooms when loading the quizList
    $scope.results = response.data;

  }).then(function(response) {});

  //join quizlist for asynchronous updates of room status
  socket.emit('joinQuizList');

  //listen for updates on all quizrooms
  socket.on('updateQuizList', function(response) {
    //this makes sure that the results is updated with new data
    $scope.$apply(function() {
      $scope.results = response;
    })

  });

  //Join quiz
  $scope.joinGame = function(quizId) {

    //Add the quizId to the rootScope of the user
    $rootScope.quizId = quizId;

    //Announce to the statemanager that the player is playing
    $rootScope.isPlaying = true;

    var data = {
      'quizId': quizId,
      'user': $rootScope.user
    };
    socket.emit('joinQuiz', data);

    //Go to quiz state
    $state.go('app.inside.quiz');
  }

  //If we leave the quizList to any other state, then we remove the users socket from the servers socket manager system.
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (fromState.name == 'app.inside.navbar.quizList' && toState.name.match(/^app\./)) {
      socket.emit('leaveQuizList');
    }
  });

});
angular.module('quiz').controller('resultsCtrl', function($scope, $log, $http) {

  //Fetch results here and populate view
  $http.get('/api/topScores').then(function(response) {

    //Fetch all the results
    $scope.scores = response.data.results;

  }).then(function(response) {
  $log.debug('Error when serving request')
  });

});

angular.module('quiz').controller('userResultsCtrl', function($http, $rootScope, $scope, $log) {

  //fetch user specific results and populate view
  var req = {'user': $rootScope.user};
  $http.post('/api/userScores', req).then(function(response) {

    //Fetch all the results
    $scope.scores = response.data.results;

  }).then(function(response) {
    $log.debug('Error when serving request')
  });

});

angular.module('quiz').controller('quizCtrl', function($rootScope, $state, $scope, $log) {

  $state.go('app.inside.quiz.waiting');

});
angular.module('quiz').controller('waitingCtrl', function($rootScope, $state, $scope, $log) {
  $scope.$parent.playerInfo = "Players in room";

 //Tell the server that you have joined so that the you can obtain the waitinglist;
  var req = {'quizId': $rootScope.quizId};
  socket.emit('userJoined', req);

  //Information about all the user that joins the room before the game is started
  socket.on('userJoined', function(data) {

    //Make sure that the sidebar list is updated whenever a new user joins
    $scope.$apply(function() {
      $scope.$parent.results = data.users;
    })

  });

  $scope.startGame = function() {

    var data = {
      'user': $rootScope.user,
      'quizId': $rootScope.quizId
    };
    socket.emit('startQuiz', data);
    $state.go('app.inside.quiz.playing');
  };

});
angular.module('quiz').controller('playingCtrl', function($rootScope, $state, $scope, $log) {

  //We need to reference the parent scope as we are in a child scope to quizCtrl.
  $scope.$parent.playerInfo = "Player who have answered";


    //Notify the server that this user is ready to recieve the first question
    var req = {'quizId': $rootScope.quizId};
    socket.emit('ready', req);

  //Update list of player who have answered
  socket.on('userAnswered', function(results) {
    $scope.$apply(function() {
      $scope.$parent.results = results.users;
    })
  });


  //get question from server
  socket.on('question', function(question) {

    //Update all the fields when a new question is served.
    $scope.$apply(function() {

        //enable the play button on a question --> disable on answer
      $rootScope.hasAnswered = false;
      $scope.choose1 = false;
      $scope.choose2 = false;
      $scope.choose3 = false;
      $scope.playCard1 = "playCard";
      $scope.playCard2 = "playCard";
      $scope.playCard3 = "playCard";
      $scope.question = question.question;
      $scope.alt1 = question.alt1;
      $scope.alt2 = question.alt2;
      $scope.alt3 = question.alt3;
      $scope.$parent.results = [];
    });

  });

  $scope.answer = function(alternative) {
    if(!$rootScope.hasAnswered){
      var data = {
        'userId': $rootScope.user,
        'answer': alternative,
        'quizId': $rootScope.quizId
      };
      $rootScope.hasAnswered = true;
      socket.emit('answer', data);
      //disable buttons before next question is done on the server
    }
  };

  //Get answer status from server
  socket.on('answer', function(res){
    var audio;
    switch(res.status){
      case true:{
        switch(res.alt){
          case "alt1":{
            $scope.playCard1 = "playCardRight";
            $scope.playCard2 = "playCardNotChosen";
            $scope.playCard3 = "playCardNotChosen";
            break;
          }
          case "alt2":{
            $scope.playCard1 = "playCardNotChosen";
            $scope.playCard2 = "playCardRight";
            $scope.playCard3 = "playCardNotChosen";
            break;
          }
          case "alt3":{
            $scope.playCard1 = "playCardNotChosen";
            $scope.playCard2 = "playCardNotChosen";
            $scope.playCard3 = "playCardRight";
            break;
          }
        }
        audio = new Audio("../../../shared/right.mp3");
        //audio = new Audio("../../../shared/right.ogg");
        break;
      }
      case false:{
        switch(res.alt){
          case "alt1":{
            $scope.playCard1 = "playCardWrong";
            $scope.playCard2 = "playCardNotChosen";
            $scope.playCard3 = "playCardNotChosen";
            break;
          }
          case "alt2":{
            $scope.playCard1 = "playCardNotChosen";
            $scope.playCard2 = "playCardWrong";
            $scope.playCard3 = "playCardNotChosen";
            break;
          }
          case "alt3":{
            $scope.playCard1 = "playCardNotChosen";
            $scope.playCard2 = "playCardNotChosen";
            $scope.playCard3 = "playCardWrong";
            break;
          }
        }
        audio = new Audio("../../../shared/wrong.mp3");
        //audio = new Audio("../../../shared/wrong.ogg");
        break;
      }
    }
    audio.play();
  });

  socket.on('gameOver', function(data) {
    $rootScope.tempRes = data;
    $state.go('app.inside.quiz.tempres');
  });

});
angular.module('quiz').controller('tempResCtrl', function($rootScope, $state, $scope, $log) {
  $scope.$parent.infoWindow = true;
  $scope.results = $rootScope.tempRes.resultList;

  $scope.done = function() {
    $state.go('app.inside.navbar.dashboard');
  };

});
