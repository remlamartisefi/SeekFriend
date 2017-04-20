// var url = 'http://mlollo.rmorpheus.enseirb.fr:8080'
// var url = 'http://localhost:8080'
var url = 'http://8f2b191c.ngrok.io'

angular.module('starter.controllers', ['ngCordova','ngStorage'])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPlatform, $localStorage) {
  // Create the login modal that we will use later
  $scope.$storage = $localStorage;
  if("undefined" === typeof $scope.$storage.islog)
    $scope.$storage.islog = false;
  if("undefined" === typeof $scope.$storage.isreg)
    $scope.$storage.isreg = false;

  $ionicModal.fromTemplateUrl('templates/login.html', {scope: $scope}).then(function(modal) {$scope.login = modal;});
  $ionicModal.fromTemplateUrl('templates/register.html', {scope: $scope}).then(function(modal) {$scope.register = modal;});
  $ionicModal.fromTemplateUrl('templates/enableGeoloc.html', {scope: $scope}).then(function(modal) {$scope.enableGeoloc = modal;});
  $ionicModal.fromTemplateUrl('templates/logout.html', {scope: $scope}).then(function(modal) {$scope.logout = modal;});
  // $ionicPopover.fromTemplateUrl('templates/my-popover.html', {scope: $scope}).then(function(popover) {$scope.popover = popover;});

  // Triggered in the login or register modal to close it
  $scope.closeLogin = function() {$scope.login.hide();};
  $scope.openLogin = function() {$scope.login.show();};
  $scope.closeRegister = function() {$scope.register.hide();};
  $scope.openRegister = function() {$scope.register.show();};
  $scope.closeGeo = function() {$scope.enableGeoloc.hide();};
  $scope.openGeo = function() {$scope.enableGeoloc.show();};
  $scope.closeLogout = function() {$scope.logout.hide();};
  $scope.openLogout = function() {$scope.logout.show();};
  // $scope.openPopover = function($event) {$scope.popover.show($event);};
  // $scope.closePopover = function() {$scope.popover.hide();};
  // Switch Modal View
  $scope.register_view = function(){$scope.closeLogin();$scope.openRegister();}
  $scope.login_view = function(){$scope.closeRegister();$scope.openLogin();}
  $scope.logout_view = function(){$scope.closeLogout();$scope.openLogout();}

  $scope.btn_login = function(){
    if($scope.$storage.islog)
      $scope.btnLogin = true;
    else 
      $scope.btnLogin = false;
  }
  $scope.btn_register = function(){
    if($scope.$storage.isreg)
      $scope.btnRegister = true;
    else 
      $scope.btnRegister = false;
  }
  $scope.btn_login();
  $scope.btn_register();
})

.controller('SignCtrl',function($scope,$timeout,$http, $sessionStorage){
  // Form data for the login modal
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
  // Perform the login action when the user submits the login form
  $scope.doLogin = function(loginData) {
    $scope.loginForm.submitted = true;

    var data = {
      email : $scope.loginData.email
    };

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
            // $cookieStore.put('email',response[0].email);
            $scope.$storage.email = response[0].email;
            $scope.$storage.pseudo = response[0].pseudo;
            $scope.$storage.user_id = response[0]._id;
            $http.defaults.headers.post["Content-Type"] = "application/json";

            $http.post(url + '/users/login', data)
              .success(function(response){
                console.log('Doing Login');
                // console.log(response);
                $scope.$storage.islog = true;
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
        email : $scope.$storage.email
      };
      console.log(data);
    $http.defaults.headers.post["Content-Type"] = "application/json";
    $http.post(url + '/users/logout', data)
      .success(function(response){
        console.log('Doing Logout');
        // console.log(response);
        $scope.$storage.islog = false;
        $scope.$storage.isreg = false;
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
    };
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
                // console.log(response);
                $scope.$storage.isreg = true;
                $scope.btn_register();
                $scope.closeRegister(); 
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

.controller('MenuCtrl', function($scope, $ionicPopup, $ionicHistory, $ionicPlatform, $cordovaGeolocation,$ionicLoading, $state, $interval, $ionicPopover,$http,$sessionStorage) {
  $scope.settings = function() {
    if($ionicHistory.currentView().url != "/app/settings")
      // $ionicConfig.views.transition('platform');
      $state.go('app.settings');
    else
      $ionicHistory.goBack();
  }; 

  var pinImage = new google.maps.MarkerImage( './img/geo2.png' , null, null, new google.maps.Point(8, 8), new google.maps.Size(16,16));
  var options = {timeout: 100000, enableHighAccuracy: true,maximumAge: 0}; 

  $scope.refreshMap = function(){
    $ionicPlatform.ready(function(){
      $ionicLoading.show({template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location !'});
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.$storage.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        geocoder.geocode({'latLng': latLng}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            $scope.map.setClickableIcons(true);
            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
              $scope.location = new google.maps.Marker({
                  map: $scope.map,
                  position: latLng,
                  icon: pinImage
              });
            });
          }
        });
        $ionicLoading.hide(); 
      }, function(error){console.log("Could not get location");console.log(error);$ionicLoading.hide();$scope.openGeo();});
    });
  }

  $scope.refreshLoc = function(panTo){
    $ionicPlatform.ready(function(){
      // console.log('refresh');
      // $ionicLoading.show({template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'});
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.$storage.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({'latLng': latLng}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
              $scope.location.setMap(null);
              $scope.location = new google.maps.Marker({
                  map: $scope.map,
                  position: latLng,
                  icon: pinImage
              });  
            });
            if(panTo)
              $scope.map.panTo(latLng);
          }
        })
      },function(error){console.log("Could not get location");console.log(error);}); 
    });
  }

  var theInterval = $interval(function(){
      $scope.refreshLoc(true);
  }.bind(this), 1000); 

  $scope.markers = [];
  $scope.addLocation = function(){
    var latLng = new google.maps.LatLng($scope.location.position.lat(), $scope.location.position.lng());
    $scope.markers.push(new google.maps.Marker({
        map: $scope.map,
        position:  latLng,
        animation: google.maps.Animation.DROP
    }));
    console.log($scope.markers[$scope.markers.length - 1]);
    var data = {
      user_id: $scope.$storage.user_id,
      lat: $scope.location.position.lat(),
      lng: $scope.location.position.lng(),
      date: new Date().toLocaleString()
    };
    console.log(data);
    $http.post(url + '/coords/add', data)
    .success(function(response){console.log('Adding a Coord');console.log(response);})
    .error(function(err, config) {console.log(config);});
  }

  $scope.showLocation = function(info){
    var latLng = new google.maps.LatLng(info.lat, info.lng);
    $scope.markers.push(new google.maps.Marker({
        map: $scope.map,
        position:  latLng,
        animation: google.maps.Animation.DROP
    }));
    console.log($scope.markers[$scope.markers.length - 1]);
  }

  $scope.toggleUser = function(user) {
    $scope.markers.forEach(function(value,key){
      value.setMap(null);
    });
    if ($scope.isUserShown(user)) {
      $scope.shownUser = null;
    } else {
      $scope.shownUser = user;
      $scope.markers = [];
      user._info.forEach(function(value,key){
        $scope.showLocation(value);
      });
    }
  };
  $scope.isUserShown = function(user) {
    return $scope.shownUser === user;
  };

  $scope.reloadFriendsList = function() {
    $http.defaults.headers.common["Accept"] = "application/json";
    $http.get(url + '/users/getall')
    .success(function(response){
      $scope.userlist = [];
      response.forEach(function(value,key){
        $scope.userlist.push({
          _user: value,
          _info: []
        });
        $http.post(url + '/coords/getall',{user_id: value._id})
        .success(function(res){
          if(res.length != 0){
            for (var j=0; j<res.length; j++) {
              $scope.userlist[key]._info.push(res[j]); 
            }
          }
        }).error(function(err, config) {console.log(config);});
      });
    }).error(function(err, config) {console.log(config);});
  };
  $scope.reloadFriendsList();
  var theInterval = $interval(function(){
      $scope.reloadFriendsList();
  }.bind(this), 30000);   

  $scope.showCookies = function(){
    console.log($scope.$storage);
  }

});

  // var contentString = 
  //               '<div id=\"marker_content\" style=\"width:100px;overflow:hidden;\">' +
  //                 'Add this location  ' + 
  //                 '<button class=\"button button-positive\" onclick=\"addLocation()\">Add</button>'
  //               '</div>';
  // $scope.infoWindow = new google.maps.InfoWindow();
  // $scope.infoWindow.setContent(contentString);

  // $scope.addLocation = function(){
  //   $ionicPlatform.ready(function(){
  //     $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
  //       var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //       google.maps.event.addListener($scope.map, 'idle', function(){
  //         $scope.marker = new google.maps.Marker({
  //             map: $scope.map,
  //             position: latLng,
  //             animation: google.maps.Animation.DROP,
  //         });  
  //       });
  //     },function(error){console.log("Could not get location");console.log(error);
  //     }); 
  //   });
  // }