// var url = 'http://mlollo.rmorpheus.enseirb.fr:8080'
// var url = 'http://localhost:8080'
// var url = 'http://b96e1293.ngrok.io'

angular.module('starter.controllers', ['ngCordova','ngStorage'])

.controller('AppCtrl', function($scope, $http, $ionicModal, $ionicPopover, $ionicPlatform, $localStorage) {
  $http.defaults.headers.common["Accept"] = "application/json";

  //  $storage initialisation
  $scope.$storage = $localStorage;
  $scope.$storage.url = 'http://mlollo.rmorpheus.enseirb.fr';
  // $scope.$storage.url = 'http://b96e1293.ngrok.io';

  if("undefined" === typeof $scope.$storage.islog)
    $scope.$storage.islog = false;
  if("undefined" === typeof $scope.$storage.isreg)
    $scope.$storage.isreg = false;
  if($scope.$storage.islog){
    $http.post($scope.$storage.url + '/users/login', {email: $scope.$storage.email})
    .success(function(response){$scope.$storage.isProfilView = false;console.log("Logged!");})
    .error(function(err, config) {console.log(config);});
  }else{
    $scope.$storage.$reset();
    $scope.$storage.url = 'http://mlollo.rmorpheus.enseirb.fr';
    $http.post($scope.$storage.url + '/users/logout', {email: $scope.$storage.email})
    .success(function(response){$scope.$storage.isProfilView = false;})
    .error(function(err, config) {console.log(config);});
  }

  $scope.$storage.dataSearch = {search : ""};
  if("number" !== typeof $scope.$storage.mapZoom)
    $scope.$storage.mapZoom = 15;

  // Create modals that we will use later
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
  $scope.register_view = function(){$scope.closeLogin();$scope.openRegister();};
  $scope.login_view = function(){$scope.closeRegister();$scope.openLogin();};
  $scope.logout_view = function(){$scope.closeLogout();$scope.openLogout();};
})

.controller('SignCtrl',function($scope,$timeout,$http, $sessionStorage){
  $http.defaults.headers.post["Content-Type"] = "application/json";

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

      $http.post($scope.$storage.url + '/users/getbyemail', data)
        .success(function(response){
          if(response.length == 1 && response[0].password == $scope.loginData.password){
            $scope.$storage.email = response[0].email;
            $scope.$storage.pseudo = response[0].pseudo;
            $scope.$storage.user_id = response[0]._id;

            $http.post($scope.$storage.url + '/users/login', data)
              .success(function(response){
                console.log('Doing Login');
                // console.log(response);
                $scope.$storage.islog = true;
                $scope.$storage.isProfilView = false;
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
    $http.post($scope.$storage.url + '/users/logout', data)
      .success(function(response){
        console.log('Doing Logout');
        // console.log(response);
        $scope.$storage.$reset();
        $scope.$storage.url = 'http://mlollo.rmorpheus.enseirb.fr';
        $scope.$storage.islog = false;
        $scope.$storage.isreg = false;
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
      $http.post($scope.$storage.url + '/users/getbyemailnpseudo', data)
        .success(function(response){
          if(response.length == 0){
            $http.post($scope.$storage.url + '/users/add', data)
              .success(function(response){
                console.log('Doing Register');
                $scope.$storage.isreg = true;
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

.controller('MapCtrl', function($scope) {
  $scope.refreshMap();
})

.controller('MenuCtrl', function($scope, $ionicPopup, $ionicHistory, 
  $ionicPlatform, $cordovaGeolocation,$ionicLoading, $state, $interval, 
  $ionicPopover,$http,$timeout) {
  $http.defaults.headers.common["Accept"] = "application/json";

  // settings option -------------------------------------------------------------------------------------
  $scope.settings = function() {
    if($ionicHistory.currentView().url != "/app/settings")
      // $ionicConfig.views.transition('platform');
      $state.go('app.settings');
    else
      $ionicHistory.goBack();
  };

  // handle map ------------------------------------------------------------------------------------------
  var pinImage = new google.maps.MarkerImage( './img/geo2.png' , null, null, new google.maps.Point(8, 8), new google.maps.Size(16,16));
  var options = {timeout: 100000, enableHighAccuracy: true,maximumAge: 0}; 
  $scope.refreshMap = function(){
    $ionicPlatform.ready(function(){
      $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner><br/>Acquiring location !'});
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.$storage.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: latLng,
          zoom: $scope.$storage.mapZoom,
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
  };

  // refresh only the blue point location
  $scope.refreshLoc = function(panTo){
    $ionicPlatform.ready(function(){
      // console.log('refresh');
      // $ionicLoading.show({template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'});
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        // var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.$storage.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // geocoder.geocode({'latLng': latLng}, function (results, status) {
        //   if (status == google.maps.GeocoderStatus.OK) {
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
          // }
        // })
      },function(error){console.log("Could not get location");console.log(error);}); 
    });
  };

  // every 5 sec refresh the blue point position
  var theInterval = $interval(function(){$scope.refreshLoc(true);}.bind(this), 5000); 

// method used in line 282 and 466 --------------------------------------------------------------------------
  $scope.refreshMenuData = function(){
    if(!$scope.$storage.searchFocused){
      if($scope.$storage.isProfilView){
        $scope.onProfil({'search' : $scope.$storage.pseudo});
        $timeout(function(){
          for(var key in $scope.profillist._info){
            if($scope.shownInfo !== null){
              if($scope.profillist._info[key]._id === $scope.shownInfo._id){
                $scope.shownInfo = $scope.profillist._info[key];
              }
            }
          }
        },1000);
      }else{
        $scope.reloadFriendsList();
        $timeout(function(){
          $scope.userlist.forEach(function(value,key){
            if($scope.shownUser !== null){
              if(value._user._id === $scope.shownUser._user._id){
                $scope.shownUser = value;
              }
            }
          });
        },1000);
      }
    }
  };

  // add a marker in your database
  $scope.markers = [];
  $scope.addLocation = function(){
    var latLng = new google.maps.LatLng($scope.location.position.lat(), $scope.location.position.lng());
    $scope.markers.push(new google.maps.Marker({
        map: $scope.map,
        position:  latLng,
        animation: google.maps.Animation.DROP
    }));
    // console.log($scope.markers[$scope.markers.length - 1]);
    var data = {
      user_id: $scope.$storage.user_id,
      lat: $scope.location.position.lat(),
      lng: $scope.location.position.lng(),
      date: new Date().toLocaleString()
    };
    $http.post($scope.$storage.url + '/coords/add', data)
    .success(function(response){
      console.log('Adding a Coord');
      $scope.refreshMenuData();
    })
    .error(function(err, config) {console.log(config);});
  };

  // show a marker from the database
  $scope.showLocation = function(info){
    var latLng = new google.maps.LatLng(info.lat, info.lng);
    $scope.markers.push(new google.maps.Marker({
        map: $scope.map,
        position:  latLng,
        animation: google.maps.Animation.DROP
    }));
  };

  // toggle fonction from the view of the sidebar menu ----------------------------------------------------
  $scope.toggleUser = function(user) {
    $scope.markers.forEach(function(value,key){value.setMap(null);});
    if($scope.isUserShown(user))
      $scope.shownUser = null;
    else {
      $scope.shownUser = user;
      $scope.markers = [];
      user._info.forEach(function(value,key){$scope.showLocation(value);});
    }
  };
  $scope.isUserShown = function(user) {return $scope.shownUser === user;};
  $scope.filterUserList = function(userlist){
    for(var key in userlist)
        if(userlist[key]._user._id == $scope.$storage.user_id && $scope.$storage.islog === true)
            userlist.splice(key,1);
    return userlist;
  };


  $scope.toggleInfo = function(info) {
    $scope.markers.forEach(function(value,key){value.setMap(null);});
    $scope.markers = [];
    if($scope.isInfoShown(info)) {
      $scope.shownInfo = null;
      $scope.profillist._info.forEach(function(value,key){$scope.showLocation(value);});
    } else {
      $scope.shownInfo = info;
      $scope.showLocation(info);
    }
  };
  $scope.isInfoShown = function(info) {return $scope.shownInfo === info;};
  $scope.filterInfo = function(info){
    var result = {};
    for(var key in info)
        if(!key.startsWith("_") && !key.endsWith('id') && !key.startsWith("date"))
            result[key] = info[key];
    return result;
  };
  
  // when your are logged in you can see your personal informations
  $scope.toggleUInfo = function() {
    if($scope.shownUInfo)
      $scope.shownUInfo = false;
    else
      $scope.shownUInfo = true;
  };

  $scope.filterUInfo = function(_user){
    var result = {};
    for(var key in _user) {
        if(!key.startsWith("_")) {
            result[key] = _user[key];
        }
    }
    return result;
  };

  // switch menu view to see your position history and your personal informations ---------------------------------
  $scope.showMyHistory = function(){
    $scope.$storage.dataSearch.search = '';
    if($scope.$storage.islog && !$scope.$storage.isProfilView){
      $scope.$storage.isProfilView = true;
      $scope.onProfil({'search' : $scope.$storage.pseudo});
      $scope.markers.forEach(function(value,key){value.setMap(null);});
      $scope.markers = [];
      $timeout(function(){
        $scope.profillist._info.forEach(function(value,key){$scope.showLocation(value);});
      },2000);
      
    }else{
      $scope.$storage.isProfilView = false;
      $scope.markers.forEach(function(value,key){value.setMap(null);});
      $scope.markers = [];
      $scope.reloadFriendsList();
    }
  };

  // refresh Friends List fonction to load in the sidebar view ---------------------------------------------
  $scope.reloadFriendsList = function() {
    $http.defaults.headers.common["Accept"] = "application/json";
    $http.get($scope.$storage.url + '/users/getall')
    .success(function(response){
      $scope.userlist = [];
      response.forEach(function(value,key){
        if(value._id != $scope.$storage.user_id){
          $scope.userlist.push({_user: value,_info: []});
          $http.post($scope.$storage.url + '/coords/getall',{user_id: value._id})
          .success(function(res){
            if(res.length != 0){
              $scope.userlist[key]._info = [];
              for (var j=0; j<res.length; j++) {
                $scope.userlist[key]._info.push(res[j]); 
              }
            }
          }).error(function(err, config) {console.log(config);});        }
      });
    }).error(function(err, config) {console.log(config);})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  };

  // Search fonctions -------------------------------------------------------------------------------------
  $scope.onSearchInput = function(data){
    // $scope.$broadcast('scroll.refreshStarted');
    $http.post($scope.$storage.url + '/users/getbypseudo',{pseudo : data.search})
    .success(function(response){
      $scope.userlist = [];
      response.forEach(function(value,key){
        $scope.userlist.push({_user: value,_info: []});
        $http.post($scope.$storage.url + '/coords/getall',{user_id: value._id})
        .success(function(res){
          // console.log(res);
          if(res.length != 0){
            $scope.userlist[key]._info = [];
            for (var j=0; j<res.length; j++) {
              $scope.userlist[key]._info.push(res[j]); 
            }
          }
        }).error(function(err, config) {console.log(config);})
      });
    }).error(function(err, config) {console.log(config);$scope.userlist = [];})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  };

  // search a specific location by date
  $scope.onSearchInputProfil = function(data){
    // console.log(data.search);
    // $scope.$broadcast('scroll.refreshStarted');
    $http.post($scope.$storage.url + '/coords/getbydate',{user_id: $scope.$storage.user_id, date: data.search})
    .success(function(res){
      // console.log(res);
      if(res.length != 0){
        $scope.profillist._info = [];
        for (var j=0; j<res.length; j++) {
          $scope.profillist._info.push(res[j]); 
        }
      }
    }).error(function(err, config) {console.log(config);})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  };

  // equivalent of refresh friends list for coords in the profil view --------------------------------------
  $scope.onProfil = function(data){
    $http.post($scope.$storage.url + '/users/getbypseudo',{pseudo : data.search})
    .success(function(response){
      if(response.length == 1){
        $scope.profillist = {_user: response[0],_info: []};
        $http.post($scope.$storage.url + '/coords/getall',{user_id: response[0]._id})
        .success(function(res){
          if(res.length != 0){
            $scope.profillist._info = [];
            for (var j=0; j<res.length; j++) {
              $scope.profillist._info.push(res[j]); 
            }
          }
        }).error(function(err, config) {console.log(config);})
      }
    }).error(function(err, config) {console.log(config);})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  };

  $scope.onSearchCancel = function(data){data.search = '';$scope.reloadFriendsList();};
  $scope.onSearchCancelProfil = function(data){data.search = '';$scope.onProfil({'search' : $scope.$storage.pseudo});};
  
  // initialisation of the sidebar view
  if($scope.$storage.isProfilView){
    $scope.onProfil({'search' : $scope.$storage.pseudo});
    $scope.markers.forEach(function(value,key){value.setMap(null);});
    $scope.markers = [];
    $timeout(function(){
      $scope.profillist._info.forEach(function(value,key){$scope.showLocation(value);});
    },5000);
  }else
    $scope.reloadFriendsList();  

  // every 100 sec. reload the view of the sidebar menu
  var theInterval = $interval(function(){$scope.refreshMenuData();}.bind(this),30000);   

  // just show what we store -------------------------------------------------------------------------------
  $scope.showStorage = function($event){console.log($scope.$storage);$scope.openPopover($event);};

  // delete a position from backend ------------------------------------------------------------------------
  $scope.deleteInfo = function(info){
    $http.post($scope.$storage.url + '/coords/rm',{id : info._id})
    .success(function(response){
      console.log("deleted !");
      $scope.profillist._info.forEach(function(val,index,arr){
        if(val._id === info._id){
          console.log(val._id);
          arr.splice(index,1);
        }
      });
    }).error(function(err, config) {console.log(config);});
  }
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
});