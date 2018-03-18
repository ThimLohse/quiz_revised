'use strict'
//Open up socket connection. This is used for socket communication with the server
var socket = io();

angular.module('quiz').controller('insideNavCtrl', function($scope, $log) {

});
angular.module('quiz').controller('dashboardCtrl', function($scope, $log) {});
angular.module('quiz').controller('quizListCtrl', function($scope, $log) {
  //Mock results
  $scope.results = [{'name': 1, 'users': 10, 'isPlaying': false},{'name': 2, 'users': 13, 'isPlaying': true},{'name': 3, 'users': 2, 'isPlaying': false},{'name': 4, 'users': 23, 'isPlaying': false}]
});
angular.module('quiz').controller('resultsCtrl', function($scope, $log) {});
angular.module('quiz').controller('userResultsCtrl', function($scope, $log) {});
angular.module('quiz').controller('quizCtrl', function($scope, $log) {

});
