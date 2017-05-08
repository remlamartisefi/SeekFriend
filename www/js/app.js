angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova','ngStorage'])

.run(['$ionicPlatform', '$location', '$localStorage','$http',function($ionicPlatform, $location, $localStorage, $http) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  window.onunload = function(){
    if($localStorage.islog){
      $http.post($localStorage.url + '/users/logout', {email: $localStorage.email,token: $localStorage.token})
      .success(function(){
        $localStorage = {};
      });
    }
  }
}])

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

  $compileProvider.imgSrcSanitizationWhitelist(/^\s(https|file|blob|cdvfile):|data:image\//);

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/map');
});