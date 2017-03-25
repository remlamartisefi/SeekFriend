# Welcome to Seek Friend Apps Dev environnement

<img src="https://cloud.githubusercontent.com/assets/1680157/9290919/b8dc1e5c-437a-11e5-8c91-e047e4810351.png">

## Installation guide
- https://www.joshmorony.com/integrating-google-maps-with-an-ionic-application/

### Creation app step by step [status=working-progress]

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
```
>bower install ngCordova
```
- Add to www/index.html 
`<script src="lib/ngCordova/dist/ng-cordova.js"></script>`
Before 
`<script src="cordova.js"></script>`
- Add ngCordova requirement in www/js/app.js 
`angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])`
```
>cordova plugin add cordova-plugin-geolocation
```

#### Include the Google Maps JavaScript SDK
Source tutorial https://developers.google.com/maps/documentation/javascript/tutorial
- Add to www/index.html 
`<script src="http://maps.google.com/maps/api/js?&key=YOUR_API_KEY_GOES_HERE"></script>` 
After 
`<script src="js/app.js"></script>`

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
  $cordovaGeolocation
  .getCurrentPosition(options)
  .then(function (position) {
    console.log('1');
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var coord = new google.maps.LatLng(47.389982, 0.688877);

    console.log('2');
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    console.log('3');
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });  

      var marker2 = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: coord
      });      

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker2, 'click', function () {
          infoWindow.open($scope.map, marker2);
      }); 

    });
  }, function(error){
    console.log("Could not get location");
  });
})
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
.labels {
 color: black;

 font-family: "Lucida Grande", "Arial", sans-serif;
 font-size: 20px;
 text-align: center;
 width: 80px;     
 white-space: nowrap;
}

```
- Add in www/templates/menu.html a ion-item in the menu list
```
<ion-item menu-close href="#/app/map">
  Map
</ion-item>
```
- Replace ionic.app.css and ionic.app.min.css files (from this project) in www/css because those files are outdated ! 
