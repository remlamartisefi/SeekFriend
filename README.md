# Welcome to Seek Friend Apps Dev environnement

## Installation guide
- https://www.joshmorony.com/integrating-google-maps-with-an-ionic-application/

### Steps Part 1 : Create ionic project
#### Generate a New Ionic Application
- Open a node terminal
```
>ionic start SeekFriend sidemenu
>cd SeekFriend
>ionic setup sass
>ionic platform add ios
>ionic platform add android
```

#### Add the Geolocation Plugin
>bower install ngCordova
```
- Add to www/index.html `<script src="lib/ngCordova/dist/ng-cordova.js"></script>` Before `<script src="cordova.js"></script>`
- Add ngCordova requirement in www/js/app.js `angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])`
```
>cordova plugin add cordova-plugin-geolocation
```

#### Include the Google Maps JavaScript SDK
Source tutorial https://developers.google.com/maps/documentation/javascript/tutorial
- Add to www/index.html `<script src="http://maps.google.com/maps/api/js?key=YOUR_API_KEY_GOES_HERE&sensor=true"></script>` After `<script src="js/app.js"></script>`

#### Add a map
- Add in www/js/app.js after the .state('app')
```
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })
  $urlRouterProvider.otherwise('/app/map');
});
```
- Add in www/js/controller.js a MapCtrl .controller()
```
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
  }, function(error){
    console.log("Could not get location");
  });
  //Add a marker on the map
  google.maps.event.addListenerOnce($scope.map, 'idle', function(){
    var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
    });      

  });
});
```
- Add in scss/ionic.app.scss
```
.scroll {
    height: 100%;
}
#map {
    width: 100%;
    height: 100%;
}
```
- Add in www/templates/menu.html a ion-item in the menu list
```
<ion-item menu-close href="#/app/map">
  Map
</ion-item>
```
