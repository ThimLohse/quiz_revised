'use strict'
var app = angular.module('quiz', ['ui.router', 'ngAnimate']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/home');

  $stateProvider
  //Main application state
  .state('app', {
    abstract: true,
    template: '<ui-view/>'
  })

  //Main public state to seperate public are from user area
  .state('app.outside', {
    abstract: true,
    template: '<ui-view/>'
  })

  //Individual public states
  .state('app.outside.navbar', {
    name: 'navbarOutside',
    abstract: true,
    templateUrl: './components/outside/navbar/navbar_outside.html',
    controller: 'outsideNavCtrl'
  })
  .state('app.outside.navbar.home',{
    name: 'home',
    url: '/home',
    templateUrl: './components/outside/home/home.html',
    controller: 'homeCtrl'
  })
  .state('app.outside.navbar.login', {
    name: 'login',
    url: '/login',
    templateUrl: './components/outside/login/login.html',
    controller: 'loginCtrl'
  })
  .state('app.outside.navbar.register', {
    name: 'register',
    url: '/register',
    templateUrl: './components/outside/register/register.html',
    controller: 'registerCtrl'
  })

  //Main private state to seperate user area from public area
  .state('app.inside', {
    abstract: true,
    template: '<ui-view/>'
  })
  .state('app.inside.navbar', {
    name: 'navbarInside',
    abstract: true,
    templateUrl: './components/inside/navbar/navbar_inside.html',
    controller: 'insideNavCtrl'
  })
  //Individiual private states
  .state('app.inside.navbar.dashboard', {
    url: '/dashboard',
    templateUrl: './components/inside/dashboard/dashboard.html',
    controller: 'dashboardCtrl'
  })
  .state('app.inside.navbar.userResults', {
    url: '/userresults',
    templateUrl: './components/inside/userResults/userResults.html',
    controller: 'userResultsCtrl'
  })
  .state('app.inside.navbar.results', {
    url: '/results',
    templateUrl: './components/inside/results/results.html',
    controller: 'resultsCtrl'
  })
  .state('app.inside.navbar.quizList', {
    url: '/quizlist',
    templateUrl: './components/inside/quizList/quizList.html',
    controller: 'quizListCtrl'
  })
  .state('app.inside.navbar.quiz', {
    url: '/quiz',
    templateUrl: './components/inside/quiz/quiz.html',
    controller: 'quizCtrl'
  });

}]);


app.run(['$rootScope','$state', '$log', function($rootScope, $state, $log){

  //default value is user is NOT logged in
  $rootScope.isLoggedin = false;
  // Thie is fired when a transition begins,
  // i.e. the user changes the url manually or it is a transition initiated by the application
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

      // Check if it is a valid state to transition to and if the state is in the inside of the app (using regex)
    if(toState.name && toState.name.match(/^app\.inside\./)){


      $log.debug("rootscope: " + $rootScope.isLoggedin);
      // user MUST be authorized to gain access to the inside of the app
      if(!$rootScope.isLoggedin){

        $log.debug('Session has expired, redirect to signin page');

        // Cancel state change if user not signed in
        event.preventDefault();

        // Redirect to login page
        return $state.go('app.outside.navbar.login');
      }
    }
    if(toState.name.match(/^app\.inside\./) && toState.name.match(/^app\.outside\./)){

      $rootScope.isLoggedin = false;
      $log.debug("rootscope: " + $rootScope.isLoggedin);
      // user MUST be authorized to gain access to the inside of the app
        return $state.go('app.outside.navbar.home');

    }

  });
}]);
