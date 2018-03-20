'use strict'
//Open up socket connection. This is used for socket communication with the server
var socket = io();

angular.module('quiz').controller('insideNavCtrl', function($scope, $log, $state) {

  $scope.logout = function(){
    $state.go('app.outside.navbar.home');
  };

});
angular.module('quiz').controller('dashboardCtrl', function($scope, $log) {});
angular.module('quiz').controller('quizListCtrl', function($state, $scope, $log, $http) {

  //Join quiz
  $scope.joinGame = function(){
    $state.go('app.inside.quiz');
  }

  //fetch quizzes here and populate view!
  //Mock results
  //$scope.results = [{'name': 1, 'users': 10, 'isPlaying': false},{'name': 2, 'users': 13, 'isPlaying': true},{'name': 3, 'users': 2, 'isPlaying': false},{'name': 4, 'users': 23, 'isPlaying': false}]

  $http.get('/api/quizRoom').then(function(response){
    $scope.results = response.data;
    $log.debug(response.data);

  }).then(function(response){

  });
});
angular.module('quiz').controller('resultsCtrl', function($scope, $log, $http) {

  //Fetch results here and populate view
});
angular.module('quiz').controller('userResultsCtrl', function($scope, $log, $http) {

  //fetch user specific results and populate view
});
angular.module('quiz').controller('quizCtrl', function($scope, $log, $http) {

  //Here we will do all "in game" communication with sockets,
  //Hand only post the final result with a post request at the end of the game.

});
