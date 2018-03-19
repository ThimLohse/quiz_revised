angular.module('quiz').controller('outsideNavCtrl', function($scope, $log) {});

angular.module('quiz').controller('homeCtrl', function($scope, $log) {});

angular.module('quiz').controller('loginCtrl', function($rootScope, $scope, $log, $http, $state) {
  //authentication service resource
  //https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
  // Hide message on default
  $scope.message = false;
  $scope.submit = function() {
    var username = $scope.username;
    var password = $scope.password;
    var req = {'user': username, 'pwd': password};

$http.post('/api/signin', req
).then(function(response){
      //If succesfull answer from server
      //if correct credentials, Login user, set authservice to correct (not secure, but rootscope.isAuth = true) redirect to inside (dashboard)
      if(response.data.success){
        $rootScope.isLoggedin = true;
        $log.debug("Successfully logged in!");
        $state.go('app.inside.navbar.dashboard')

      }else{
        //if incorrect credentials, send message user
        $scope.status = "is-danger"
        $scope.messageHeader = "Sorry! The username or password was incorrect!";
        $scope.messageBody = "Either you are not registered yet or the credentials were incorrect. Try again or head over to the register page";
        $scope.message = true;
      }


    }).then(function(response){
      //show a default message if request was unsuccesful!
      $scope.status = "is-danger"
      $scope.messageHeader = "Sorry! Something went wrong with the request. Please try again!";
      $scope.messageBody = "No user have been created.";
      $scope.message = true;
      $log.debug(response);
    });

  }
});

angular.module('quiz').controller('registerCtrl', function($scope, $log, $http) {
  // Hide message on default
  $scope.message = false;
  $scope.submit = function() {
    var username = $scope.username;
    var password = $scope.password;
    var vpassword = $scope.vpassword;
      //send post request with username and password to the server
      $scope.username = '';
      $scope.password = '';
      $scope.vpassword = '';

      $http.post('/api/signup', {
        'user': username,
        'pwd': password
      }).then(function(response) {


        if(response.data.success){
          //if successfully created user
          $scope.status = "is-success"
          $scope.messageHeader = "Congratulations. A new user has been created with username: " + $scope.username;
          $scope.messageBody = "You can now head over to the login page to start playing Quiz Quest! Happy questing!";
          $scope.message = true;
        }
        else{
          //show an error message if username is taken
          $scope.status = "is-danger"
          $scope.messageHeader = "Sorry! The username has already been taken by someone else!";
          $scope.messageBody = "Try to register again with a different username";
          $scope.message = true;
        }


      }, function(response) {

        //show a default message if request was unsuccesful!
        $scope.status = "is-danger"
        $scope.messageHeader = "Sorry! Something went wrong with the request. Please try again!";
        $scope.messageBody = "No user have been created.";
        $scope.message = true;
        $log.debug(response);
      });
  };

  $scope.hideMessage = function(){
    $scope.message = false;
  }

});
