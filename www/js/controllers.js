angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // var geo = {};
  // $scope.$on('$ionicView.enter', function(e) {
  //       geo = google.maps.Geocoder();
  // });

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true}; 
  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var coord = new google.maps.LatLng(47.389982, 0.688877);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

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
    //Wait until the map is loaded
  }, function(error){
    console.log("Could not get location");
  });

  // function addInfoWindow(marker, content) {
  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });
  //   google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open($scope.map, marker);
  //   });
  // }

  // $cordovaGeolocation.watchPosition().subscribe((position) => {
  //   var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  //   var marker = new google.maps.Marker({
  //     map: $scope.map,
  //     icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
  //       new google.maps.Size(22, 22),
  //       new google.maps.Point(0, 18),
  //       new google.maps.Point(11, 11)),
  //     position: latLng
  //   });

  //   let content = "<h4>You are here</h4>";
  //   this.addInfoWindow(marker, content);

  // }, (err) => {
  //   console.log(err);
  // });
})

.controller('MenuCtrl', function($scope, $ionicPopup, $ionicHistory, $state, $ionicPopover) {
  $scope.settings = function() {
    if($ionicHistory.currentView().url != "/app/settings"){
      // $ionicConfig.views.transition('platform');
      $state.go('app.settings');
    }else{
      $ionicHistory.goBack();
    }
  }; 

  //Popover
  // .fromTemplate() method
  var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
   scope: $scope
  });

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hidden popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
  // Execute hide popover
  $scope.$on('popover.hidden', function() {
    document.getElementById("popover").$on('click',function(){
      $scope.popover.hide();
    });
  });
});
 
 //alert////////////////////////////////////:
     // $scope.settings = function() {
    //  var alertPopup = $ionicPopup.alert({
    //    title: 'Alert',
    //    template: JSON.stringify($ionicHistory.currentView())
    //  });
    //   alertPopup.then(function(res) {
    //     console.log('Thank you for not eating my delicious ice cream cone');
    //   });
    // };



// Marker /////////////////////////////////:::::
// function ts_newMapMarker($marker, map)
// {

//     var marker;

//     var dataCountry = $marker.attr('data-country');
//     console.log("Country: " + dataCountry);

//     geocoder = new google.maps.Geocoder();
//     function getCountry(country) {
//         geocoder.geocode( { 'address': country }, function(results, status) {
//             if (status == google.maps.GeocoderStatus.OK) {
//                 map.setCenter(results[0].geometry.location);
//                 marker = new google.maps.Marker({
//                     map: map,
//                     position: results[0].geometry.location,
//                     icon    : '<?php bloginfo('template_url'); ?>/assets/images/map-marker.png'
//                 });

//                 map.markers.push( marker );

//                 getCountry(dataCountry);

//                 // if marker contains HTML, add it to an infoWindow
//                 if($marker.html())
//                 {
//                     // create info window
//                     var infowindow = new google.maps.InfoWindow({
//                         content     : $marker.html()
//                     });

//                     // show info window when marker is clicked
//                     google.maps.event.addListener(marker, 'click', function() {
//                         console.log("open info window");
//                         infowindow.open( map, marker );
//                     });
//                 }
//             } else {
//                 alert("Geocode was not successful for the following reason: " + status);
//             }
//         });
//     }

// }



