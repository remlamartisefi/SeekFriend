// Ionic Starter App
var Application = function(){
    this.user_id;
    this.lat;
    this.long;
    this.isLog = false;
    this.isReg = false;
    this.email;
    this.pseudo;
  }
  Application.setPosition = function([lat, long]){this.lat = lat;this.long = long;}
  Application.getPosition = function(){return new google.maps.LatLng(this.lat,this.long);}
  Application.setIsLog = function(is){this.isLog = is;}
  Application.getIsLog = function(){return this.isLog;}
  Application.setIsReg = function(is){this.isReg = is;}
  Application.getIsReg = function(){return this.isReg;}
  Application.setUser_id = function(id){this.user_id = id;}
  Application.getUser_id = function(){return this.user_id};
  Application.setEmail = function(email){this.email = email;}
  Application.getEmail = function(){return this.email;}
  Application.setPseudo = function(pseudo){this.pseudo = pseudo;}
  Application.getPseudo = function(){return this.pseudo;}
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])
// angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova','angular-md5','ionic-native-transitions'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    // if (window.cordova && window.cordova.plugins.ngCordova) {
    // }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  // $ionicNativeTransitions.enable(true);
  // $ionicNativeTransitionsProvider.setDefaultOptions({
  //   duration: 400, // in milliseconds (ms), default 400,
  //   slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
  //   iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
  //   androiddelay: -1, // same as above but for Android, default -1
  //   winphonedelay: -1, // same as above but for Windows Phone, default -1,
  //   fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
  //   fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
  //   triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
  //   backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
  // });
  // $ionicNativeTransitionsProvider.setDefaultTransition({
  //   type: 'slide',
  //   direction: 'up'
  // });
  // $ionicNativeTransitionsProvider.setDefaultBackTransition({
  //   type: 'slide',
  //   direction: 'down'
  // });

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
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/map');
});