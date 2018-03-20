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

  //Get the list the first time
  $http.get('/api/quizList').then(function(response) {

    //Fetch all the quizrooms when loading the quizList
    $scope.results = response.data;

  }).then(function(response) {});

  //join quizlist for asynchronous updates of room status
  socket.emit('joinQuizList');

  //listen for updates on all quizrooms
  socket.on('updateQuizList', function(data) {
    $scope.results = data;
  });

  //Join quiz
  $scope.joinGame = function(quizId) {

    //Add the quizId to the rootScope of the user
    $rootScope.quizId = quizId;
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
      $log.debug('user left quiz list');
    }
  });

});
angular.module('quiz').controller('resultsCtrl', function($scope, $log) {

  //Fetch results here and populate view
});
angular.module('quiz').controller('userResultsCtrl', function($scope, $log) {

  //fetch user specific results and populate view
});
angular.module('quiz').controller('quizCtrl', function($rootScope, $state, $scope, $log) {

  //TODO separera logiken mellan waitingcontroller och playing controller?
  $state.go('app.inside.quiz.waiting');

});
angular.module('quiz').controller('waitingCtrl', function($rootScope, $state, $scope, $log) {
  $scope.$parent.playerInfo = "Players in room";
  $scope.$parent.results = [
    {
      'user': 'Kalle'
    }, {
      'user': 'Stefan'
    }, {
      'user': 'Niklas'
    }, {
      'user': 'Fanny'
    }, {
      'user': 'Lisa'
    }, {
      'user': 'Nadja'
    }, {
      'user': 'Bengt'
    }
  ];

  //är detta informationen om alla användare som ansluter??
  socket.on('userJoined', function(data) {
    $scope.$parent.results = data.users;
  });

  $scope.startGame = function() {
    //vad ska skickas här med socket?
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

  //All answer buttons are disabled before first question.
  $scope.waiting = true;

  //Mock data
  $scope.$parent.results = [
    {
      'user': 'Kalle'
    }, {
      'user': 'Stefan'
    }, {
      'user': 'Niklas'
    }, {
      'user': 'Nadja'
    }, {
      'user': 'Bengt'
    }
  ];

  socket.on('question', function(question) {
    $scope.waiting = false;
    $scope.question = question.question;
    $scope.alt1 = question.alt1;
    $scope.alt2 = question.alt2;
    $scope.alt3 = question.alt3;
  });

  $scope.answer = function(alternative) {
    var data = {
      'userId': $rootScope.user,
      'answer': alternative,
      'quizId': $rootScope.quizId
    };
    socket.emit('answer', data);
  };

  //Mock
  $rootScope.tempRes = {'resultList': [{'user': 'Kalle', 'score':10},{'user': 'Nina', 'score':20},{'user': 'Nils', 'score':40}]};
  socket.on('gameOver', function(data){
    $rootScope.tempRes = data;
    $state.go('app.inside.quiz.tempres');
  });

});
angular.module('quiz').controller('tempResCtrl', function($rootScope, $state, $scope, $log){
  $scope.$parent.infoWindow = true;
  $scope.results = $rootScope.tempRes.resultList;

  $scope.done = function(){
    $state.go('app.inside.navbar.dashboard');
  };

});
