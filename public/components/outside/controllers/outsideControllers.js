angular.module('quiz').controller('outsideNavCtrl', function($scope, $log) {

});

angular.module('quiz').controller('homeCtrl', function($scope, $log) {});

angular.module('quiz').controller('loginCtrl', function($scope, $log) {
});

angular.module('quiz').controller('registerCtrl', function($scope, $log, $http) {

  $scope.submit = function(){
    var username = $scope.username;
    var password = $scope.password;
    var vpassword = $scope.vpassword;
    if(password === vpassword){
      //send post request with username and password to the server
      $log.debug("new user successfully created");
      $scope.username = '';
      $scope.password = '';
      $scope.vpassword = '';

      $http.post('/api/signup', {'username': username, 'pwd': password}).then(function(response){

        $log.debug(response);
      }, function(response){

        $log.debug('not succesfull');
      });
    }
    else{
      //display some type of message?
      $log.debug("new user could not be created. Passwords do not match");
      $scope.username = '';
      $scope.password = '';
      $scope.vpassword = '';
    }
  };
  $scope.cancel = function(){
    $scope.username = '';
    $scope.password = '';
    $scope.vpassword = '';
  };
});
