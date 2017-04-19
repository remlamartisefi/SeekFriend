var url = 'http://mlollo.rmorpheus.enseirb.fr'
// var url = 'http://localhost:8080'
// var url = 'http://6583358e.ngrok.io'

angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPlatform) {
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {scope: $scope}).then(function(modal) {$scope.login = modal;});
  $ionicModal.fromTemplateUrl('templates/register.html', {scope: $scope}).then(function(modal) {$scope.register = modal;});
  $ionicModal.fromTemplateUrl('templates/enableGeoloc.html', {scope: $scope}).then(function(modal) {$scope.enableGeoloc = modal;});
  $ionicModal.fromTemplateUrl('templates/logout.html', {scope: $scope}).then(function(modal) {$scope.logout = modal;});
  $ionicPopover.fromTemplateUrl('templates/my-popover.html', {scope: $scope}).then(function(popover) {$scope.popover = popover;});

  // Triggered in the login or register modal to close it
  $scope.closeLogin = function() {$scope.login.hide();};
  $scope.openLogin = function() {$scope.login.show();};
  $scope.closeRegister = function() {$scope.register.hide();};
  $scope.openRegister = function() {$scope.register.show();};
  $scope.closeGeo = function() {$scope.enableGeoloc.hide();};
  $scope.openGeo = function() {$scope.enableGeoloc.show();};
  $scope.closeLogout = function() {$scope.logout.hide();};
  $scope.openLogout = function() {$scope.logout.show();};
  $scope.openPopover = function($event) {$scope.popover.show($event);};
  $scope.closePopover = function() {$scope.popover.hide();};
  // Switch Modal View
  $scope.register_view = function(){$scope.closeLogin();$scope.openRegister();}
  $scope.login_view = function(){$scope.closeRegister();$scope.openLogin();}
  $scope.logout_view = function(){$scope.closeLogout();$scope.openLogout();}

  $scope.btn_login = function(){
    if(Application.getIsLog())
      $scope.btnLogin = true;
    else 
      $scope.btnLogin = false;
  }
  $scope.btn_register = function(){
    if(Application.getIsReg())
      $scope.btnRegister = true;
    else 
      $scope.btnRegister = false;
  }
})

.controller('SignCtrl',function($scope,$timeout,$http){
  // Form data for the login modal
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
  // Perform the login action when the user submits the login form
  $scope.doLogin = function(loginData) {
    $scope.loginForm.submitted = true;

    var data = {
      email : $scope.loginData.email
    }

    if($scope.loginForm.submitted 
      && !$scope.loginForm.Email.$invalid 
      && !$scope.loginForm.Email.$error.email 
      && !$scope.loginForm.Email.$error.pattern
      && !$scope.loginForm.Password.$invalid 
      && !$scope.loginForm.Password.$error.minlength
      && !$scope.loginForm.Password.$error.maxlength)
    {

      $http.post(url + '/users/getbyemail', data)
        .success(function(response){
          if(response.length == 1 && response[0].password == $scope.loginData.password){
            Application.setEmail(response[0].email);
            Application.setPseudo(response[0].pseudo);
            Application.setUser_id(response[0]._id);
            console.log('Doing Login');
            $http.defaults.headers.post["Content-Type"] = "application/json";

            $http.post(url + '/users/login', data)
              .success(function(response){
                console.log(response);
                Application.setIsLog(true);
                $scope.btn_login();
                $scope.closeLogin();
              }).error(function(err, config) {console.log(config);});
          }else{
            $scope.loginForm.$error = false;
          }
        }).error(function(err, config) {console.log(config);});  
    }    
    $timeout(function() {
      $scope.closeLogin();
    }, 60000);
  };

  $scope.doLogout = function() {
     var data = {
        email : Application.getEmail()
      }
      console.log(data);
    $http.defaults.headers.post["Content-Type"] = "application/json";
    $http.post(url + '/users/logout', data)
      .success(function(response){
        console.log('Doing Logout');
        console.log(response);
        Application.setIsLog(false);
        Application.setIsReg(false);
        $scope.btn_login();
        $scope.btn_register();
        $scope.closeLogout();
      }).error(function(err, config) {console.log(config);});
  };

  $scope.doRegister = function() {
    $scope.registerForm.submitted = true;
    var data = {
      email : $scope.registerData.email,
      pseudo : $scope.registerData.pseudo,
      password : $scope.registerData.password
    }
    if($scope.registerForm.submitted 
      && !$scope.registerForm.Email.$invalid 
      && !$scope.registerForm.Email.$error.email 
      && !$scope.registerForm.Email.$error.pattern
      && !$scope.registerForm.Pseudo.$error.minlength 
      && !$scope.registerForm.Pseudo.$error.maxlength
      && !$scope.registerForm.Password.$invalid 
      && !$scope.registerForm.Password.$error.minlength
      && !$scope.registerForm.Password.$error.maxlength)
    {
      $http.post(url + '/users/getbyemailnpseudo', data)
        .success(function(response){
          //console.log(response);
          if(response.length == 0){
            console.log('Doing Register');
            $http.defaults.headers.post["Content-Type"] = "application/json";

            $http.post(url + '/users/add', data)
              .success(function(response){
                //console.log(response);
                Application.setIsReg(true);
                // Application.setIsLog(true);
                Application.setEmail(data.email);
                Application.setPseudo(data.pseudo);
                
                 $http.post(url + '/users/getbyemailnpseudo', data)
                    .success(function(response){
                      //console.log(response);
                      Application.setUser_id(response[0]._id);
                      $scope.btn_register();
                      $scope.closeRegister(); 
                    }).error(function(err, config) {console.log(config);});
              }).error(function(err, config) {console.log(config);});
          }else{
            $scope.registerForm.$error = false;
          }
        }).error(function(err, config) {console.log(config);}); 
    }
    $timeout(function() {
      $scope.closeRegister();
    }, 60000);
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

.controller('MapCtrl', function($scope) {
    $scope.refreshMap();
})

.controller('MenuCtrl', function($scope, $ionicPopup, $ionicHistory, $ionicPlatform, $cordovaGeolocation,$ionicLoading, $state, $interval, $ionicPopover,$http) {
  $scope.settings = function() {
    if($ionicHistory.currentView().url != "/app/settings")
      // $ionicConfig.views.transition('platform');
      $state.go('app.settings');
    else
      $ionicHistory.goBack();
  }; 
  
  $scope.reloadFriendsList = function() {
    $http.defaults.headers.common["Accept"] = "application/json";
    $http.get(url + '/users/getpseudo')
    .success(function(response){console.log(response);$scope.pseudolist = response;})
    .error(function(err, config) {console.log(config);});
  };
  $scope.reloadFriendsList();
  var theInterval = $interval(function(){
      $scope.reloadFriendsList();
  }.bind(this), 30000);   
   

  // //Cleanup the popover when we're documentne with it!
  // $scope.$on('$destroy', function() {
  //   $scope.popover.remove();
  // });
  // // Execute action on hidden popover
  // $scope.$on('popover.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove popover
  // $scope.$on('popover.removed', function() {
  //   // Execute action
  // });
  // refreshGeoloca for mapCtrl
  $scope.refreshMap = function(){
    $ionicPlatform.ready(function(){
      $ionicLoading.show({template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'});
      var options = {timeout: 100000, enableHighAccuracy: true,maximumAge: 0}; 
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        Application.setPosition([position.coords.latitude, position.coords.longitude]);
        var coord = new google.maps.LatLng(47.389982, 0.688877);
        var mapOptions = {
          center: latLng,
          zoom: 19,
          fullscreenControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DEFAULT,
              position: google.maps.ControlPosition.LEFT_TOP
          },
          motionTrackingControl: true,
          motionTrackingControlOptions: {
            // style: google.maps.MapTypeControlStyle.DEFAULT,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          PanControl: true,
          PanControlOptions: {
            // style: google.maps.MapTypeControlStyle.DEFAULT,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        geocoder.geocode({'latLng': latLng}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            $scope.map.setClickableIcons(true);
            var pinImage = new google.maps.MarkerImage( './img/geo2.png' , null, null, new google.maps.Point(0, 0), new google.maps.Size(16,16));
            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
              $scope.marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.BOUNCE,
                  position: latLng,
                  icon: pinImage
              });
            });
            google.maps.event.addListener($scope.map, 'idle', function(){
              $scope.marker.setMap(null);
              $scope.marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.BOUNCE,
                  position: latLng,
                  icon: pinImage
              });  
            });
            // var infoWindow = new google.maps.InfoWindow({content: "Here I am!"});
            // google.maps.event.addListener($scope.marker, 'click', function () {infoWindow.open($scope.map, marker2);}); 
          }
        });
        $ionicLoading.hide(); 
      }, function(error){console.log("Could not get location");console.log(error);$ionicLoading.hide();});
    });
  }

  $scope.refreshLoc = function(){
    $ionicPlatform.ready(function(){
      $ionicLoading.show({template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'});
      var options = {timeout: 100000, enableHighAccuracy: true,maximumAge: 0}; 
      var pinImage = new google.maps.MarkerImage( './img/geo2.png' , null, null, new google.maps.Point(0, 0), new google.maps.Size(16,16));
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        google.maps.event.addListener($scope.map, 'idle', function(){
          $scope.marker.setMap(null);
          $scope.marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.BOUNCE,
              position: latLng,
              icon: pinImage
          });  
        });
        $scope.map.setCenter(latLng);  
        $ionicLoading.hide(); 
      },function(error){console.log("Could not get location");console.log(error);
        $ionicLoading.hide();
      }); 
    });
  }
});



  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // var geo = {};
  // $scope.$on('$ionicView.enter', function(e) {
  //       geo = google.maps.Geocoder();
  // });
 
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