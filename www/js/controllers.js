angular.module('starter.controllers', ['ngCordova','ngStorage'])

.controller('AppCtrl', function($scope, $http, $ionicModal, $ionicPopover, $localStorage) {
  $http.defaults.headers.common["Accept"] = "application/json";

  //  $storage initialisation
  $scope.$storage = $localStorage;
  $scope.$storage.url = 'http://mlollo.rmorpheus.enseirb.fr';
  $scope.$storage.panToLocation = true;
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
    if($scope.$storage.email.length != 0){
      $http.post($scope.$storage.url + '/users/logout', {email: $scope.$storage.email})
      .success(function(response){$scope.$storage.isProfilView = false;})
      .error(function(err, config) {console.log(config);});
    }
    $scope.$storage.isreg = false;
    $scope.$storage.email = '';
    $scope.$storage.password = '';
    $scope.$storage.pseudo = '';
    $scope.$storage.user_id = '';
  }

  $scope.$storage.dataSearch = {search : ""};
  if("number" !== typeof $scope.$storage.mapZoom)
    $scope.$storage.mapZoom = 15;

  // Create modals that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {scope: $scope}).then(function(modal) {$scope.login = modal;});
  $ionicModal.fromTemplateUrl('templates/register.html', {scope: $scope}).then(function(modal) {$scope.register = modal;});
  $ionicModal.fromTemplateUrl('templates/enableGeoloc.html', {scope: $scope}).then(function(modal) {$scope.enableGeoloc = modal;});
  $ionicModal.fromTemplateUrl('templates/logout.html', {scope: $scope}).then(function(modal) {$scope.logout = modal;});
  $ionicModal.fromTemplateUrl('templates/addFriendModal.html', {scope: $scope}).then(function(modal) {$scope.addFriendModal = modal;});
  $ionicModal.fromTemplateUrl('templates/removeFriendModal.html', {scope: $scope}).then(function(modal) {$scope.removeFriendModal = modal;});
  $ionicModal.fromTemplateUrl('templates/removeInfoModal.html', {scope: $scope}).then(function(modal) {$scope.removeInfoModal = modal;});
  $ionicModal.fromTemplateUrl('templates/addLocation.html', {scope: $scope}).then(function(modal) {$scope.addLocationModal = modal;});
  $ionicModal.fromTemplateUrl('templates/previousLocation.html', {scope: $scope}).then(function(modal) {$scope.previousLocationModal = modal;});
  $ionicPopover.fromTemplateUrl('templates/set-server-url.html', {scope: $scope}).then(function(popover) {$scope.popoverUrl = popover;});
  $ionicPopover.fromTemplateUrl('templates/popoverMenu.html', {scope: $scope}).then(function(popover) {$scope.popoverMenu = popover;});

  // Triggered in the login or register modal to close it
  $scope.closeLogin = function() {$scope.login.hide();};
  $scope.openLogin = function() {$scope.login.show();};
  $scope.closeRegister = function() {$scope.register.hide();};
  $scope.openRegister = function() {$scope.register.show();};
  $scope.closeGeo = function() {$scope.enableGeoloc.hide();};
  $scope.openGeo = function() {$scope.enableGeoloc.show();};
  $scope.closeLogout = function() {$scope.logout.hide();};
  $scope.openLogout = function() {$scope.logout.show();};
  $scope.openPopoverUrl = function($event) {$scope.popoverUrl.show($event);};
  $scope.closePopoverUrl = function() {$scope.popoverUrl.hide();};  
  $scope.openPopoverMenu = function($event) {$scope.popoverMenu.show($event);};
  $scope.closePopoverMenu = function() {$scope.popoverMenu.hide();};
  $scope.closeFriend = function() {$scope.addFriendModal.hide();};
  $scope.openFriend = function(user) {$scope.addFriendModal.show();$scope.addFriendModal.data = user;};
  $scope.closeRemoveFriend = function() {$scope.removeFriendModal.hide();};
  $scope.openRemoveFriend = function(user) {$scope.removeFriendModal.show();$scope.removeFriendModal.data = user;}; 
  $scope.closeRemoveInfo = function() {$scope.removeInfoModal.hide();};
  $scope.openRemoveInfo = function(info) {$scope.removeInfoModal.show();$scope.removeInfoModal.info = info;};
  $scope.closePreviousLocation = function() {$scope.previousLocationModal.hide();};
  $scope.openPreviousLocation = function() {$scope.previousLocationModal.show();};
  $scope.closeAddLocation = function() {$scope.addLocationModal.hide();};
  $scope.openAddLocation = function() {$scope.addLocationModal.show();};
  // Switch Modal View
  $scope.register_view = function(){$scope.closeLogin();$scope.openRegister();};
  $scope.login_view = function(){$scope.closeRegister();$scope.openLogin();};
  // $scope.logout_view = function(){$scope.closeLogout();$scope.openLogout();};
  // $scope.addLocation_view = function(){$scope.closeAddLocation();$scope.openPreviousLocation();};
  // $scope.previousLocation_view = function(){$scope.openPreviousLocation();$scope.openPreviousLocation();};

  // Fix bug prerequisite you open a popover and a modal that's in a link in the popover
  // When you hide this modal the popover is still open and touch / click is disable
  $scope.$on('modal.hidden', function () {$scope.popoverMenu.hide();});
})

.controller('SignCtrl',function($scope,$timeout,$http, $sessionStorage){
  $http.defaults.headers.post["Content-Type"] = "application/json";

  // Form data for the login modal and others
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.rangeData = {};
  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
  $scope.numberFormat = /^[0-9]+(\.[0-9]{2,4})?$/;
  $scope.dateFormat = /^([0-9]{2}[-/][0-9]{2}[-/][0-9]{4}[- ][0-9]{2}[-:][0-9]{2}[-:][0-9]{2})|([0-9]{14})/;

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
        $scope.$storage.email = '';
        $scope.$storage.password = '';
        $scope.$storage.pseudo = '';
        $scope.$storage.user_id = '';       
        $scope.$storage.islog = false;
        $scope.$storage.isreg = false;
        if($scope.markers){
          $scope.markers.forEach(function(value,key){value.setMap(null);})
          $scope.markers = [];
        }
        $scope.closeLogout();
      }).error(function(err, config) {console.log(config);});
  };

  $scope.doRegister = function(registerData) {
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

.controller('SettingsCtrl', function($scope) {
  $scope.$storage.settingsList = [
  {
    name: "panToLocation",
    text: "Camera focus on your location",
    checked: $scope.$storage.panToLocation
  },  
  {
    name: "refreshMap",
    text: "Reload map",
    checked: false
  }
  ];

  $scope.updateItemSettings = function(item){
    if(item.name === "panToLocation"){
      $scope.$storage.panToLocation = item.checked;
    }
    else if(item.name === "refreshMap"){
      $scope.refreshMap();
      item.checked = false
    }
  };
})

.controller('MenuCtrl', function($scope, $rootScope, $ionicPopup, $ionicHistory, 
  $ionicPlatform, $cordovaGeolocation, $ionicLoading, $state, $interval, 
  $ionicPopover, $http, $timeout, $ionicSideMenuDelegate) {
  $http.defaults.headers.common["Accept"] = "application/json";

  // settings option -------------------------------------------------------------------------------------
  $scope.settings = function() {
    if($ionicHistory.currentView().url != "/app/settings")
      // $ionicConfig.views.transition('platform');
      $state.go('app.settings');
    // else
    //   $ionicHistory.goBack();
  };
  $scope.isMapView = function(){
    if($ionicHistory.currentView().url == "/app/map")
      return true;
    else 
      return false;
  };
  $scope.recenterMap = function(){
    if(!$scope.$storage.panToLocation){
      $scope.$storage.panToLocation = true;
    }
    if($scope.shownInfo !== null){
      $scope.toggleInfo($scope.shownInfo);
    }else{
      $scope.refreshLoc();
    }
  };

  // handle map ------------------------------------------------------------------------------------------
  var pinImage = new google.maps.MarkerImage( './img/geo2.png' , null, null, new google.maps.Point(8, 8), new google.maps.Size(16,16));
  var options = {timeout: 20000, enableHighAccuracy: true,maximumAge: 0}; 
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
            $rootScope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            $rootScope.map.setClickableIcons(true);
            if($rootScope.map !== undefined || $rootScope.map !== null){
              google.maps.event.addListener($rootScope.map, 'idle', function(){
                $rootScope.location = new google.maps.Marker({
                    map: $rootScope.map,
                    position: latLng,
                    icon: pinImage
                });
              });
            }
          }
        });
        $ionicLoading.hide(); 
      }, function(error){console.log("Could not get location");console.log(error);$ionicLoading.hide();$scope.openGeo();});
    });
  };

  // refresh only the blue point location
  $scope.refreshLoc = function(panTo){
    $ionicPlatform.ready(function(){
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.$storage.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if($rootScope.location !== undefined){
            $rootScope.location.setMap(null);
            $rootScope.location = new google.maps.Marker({
                map: $rootScope.map,
                position: latLng,
                icon: pinImage
            });
          if(panTo)
            $rootScope.map.panTo(latLng);
        }
      },function(error){console.log("Could not get location");console.log(error);}); 
    });
  };

  // every 5 sec refresh the blue point position
  var theInterval = $interval(function(){
    if($scope.$storage.panToLocation !== undefined || $scope.$storage.panToLocation !== null){
      $scope.refreshLoc($scope.$storage.panToLocation);
    }else{
      $scope.$storage.panToLocation = true;
      $scope.refreshLoc($scope.$storage.panToLocation);
    }
  }.bind(this), 5000); 

  // add a marker in your database
  $scope.markers = [];
  $scope.infowindows = [];
  $scope.addLocation = function(){
    var latLng = new google.maps.LatLng($rootScope.location.position.lat(), $rootScope.location.position.lng());
    $scope.markers.push(new google.maps.Marker({
        map: $rootScope.map,
        position:  latLng,
        animation: google.maps.Animation.DROP
    }));
    var data = {
      user_id: $scope.$storage.user_id,
      lat: $rootScope.location.position.lat(),
      lng: $rootScope.location.position.lng(),
      date: new Date().toLocaleString()
    };
    $scope.infowindows.push(new google.maps.InfoWindow({content: "<div class='row row-center'><label>"+data.date+"</label></div>"}));  
    $scope.markers[$scope.markers.length-1].addListener('click', function() {
      $scope.infowindows[$scope.infowindows.length-1].open($scope.map, $scope.markers[$scope.markers.length-1]);
    });

    $http.post($scope.$storage.url + '/coords/add', data)
    .success(function(response){
      console.log('Adding a Coord');
      $scope.refreshMenuData();
    })
    .error(function(err, config) {console.log(config);});
  };

  $scope.doRegisterPreviousLocation = function(rangeData) {
    var latLng = new google.maps.LatLng($rootScope.location.position.lat(), $rootScope.location.position.lng());
    $scope.markers.push(new google.maps.Marker({
        map: $rootScope.map,
        position:  latLng,
        animation: google.maps.Animation.DROP
    }));
    var data = {
      user_id: $scope.$storage.user_id,
      lat: $scope.rangeData.latitude,
      lng: $scope.rangeData.longitude, 
      date: $scope.rangeData.date
    };
    $scope.infowindows.push(new google.maps.InfoWindow({content: "<div class='row row-center'><label>"+data.date+"</label></div>"}));  
    $scope.markers[$scope.markers.length-1].addListener('click', function() {
      $scope.infowindows[$scope.infowindows.length-1].open($scope.map, $scope.markers[$scope.markers.length-1]);
    });
    if(($scope.rangeData.longitude > -31) && ($scope.rangeData.longitude < 115) && ($scope.rangeData.latitude < 50) && ($scope.rangeData.latitude > -120) ){
      $http.post($scope.$storage.url + '/coords/add', data).success(function(response){
        console.log('Adding a Coord');
        $scope.refreshMenuData();
        $scope.closePreviousLocation(); 
      }).error(function(err, config) {console.log(config);});
    }
   };

  // show a marker from the database
  $scope.showLocation = function(info){
    var latLng = new google.maps.LatLng(info.lat, info.lng);
    $scope.markers.push(new google.maps.Marker({
        map: $scope.map,
        position:  latLng,
        animation: google.maps.Animation.DROP
    }));
    $scope.infowindows.push(new google.maps.InfoWindow({content: "<div class='row row-center'><label>"+info.date+"</label></div>"}));  
    $scope.markers[$scope.markers.length - 1].addListener('click', function() {
      $scope.infowindows[$scope.infowindows.length - 1].open($scope.map, $scope.markers[$scope.markers.length - 1]);
    });
    return latLng;
  };

  // toggle fonction from the view of the sidebar menu ----------------------------------------------------
  $scope.toggleUser = function(user) {
    if(user.isfriend){
      $scope.markers.forEach(function(value,key){value.setMap(null);});
      console.log(user);
      if($scope.isUserShown(user))
        $scope.shownUser = null;
      else {
        $scope.shownUser = user;
        $scope.markers = [];
        user.info.forEach(function(value,key){$scope.showLocation(value);});
      }
    }
  };
  $scope.isUserShown = function(user) {return $scope.shownUser === user;};
  $scope.filterUserList = function(userlist){
    for(var key in userlist)
        if(userlist[key].user._id == $scope.$storage.user_id && $scope.$storage.islog === true)
            userlist.splice(key,1);
    return userlist;
  };

  $scope.toggleInfo = function(info) {
    $scope.markers.forEach(function(value,key){value.setMap(null);});
    $scope.markers = [];
    if($scope.isInfoShown(info)) {
      $scope.shownInfo = null;
      $scope.profillist.info.forEach(function(value,key){$scope.showLocation(value);});
    } else {
      $ionicSideMenuDelegate.toggleLeft(false);
      $scope.$storage.panToLocation = false;
      $scope.map.panTo($scope.showLocation(info));
      $scope.shownInfo = info;
      $scope.infowindow = new google.maps.InfoWindow();  
      $scope.infowindow.setContent("<div class='row row-center'><label>"+info.date+"</label></div>");
      $scope.infowindow.open($scope.map, $scope.markers[0]);
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

  $scope.filterUInfo = function(user){
    var result = {};
    for(var key in user) {
        if(!key.startsWith("_")) {
            result[key] = user[key];
        }
    }
    return result;
  };

  $scope.infoWindow = function(info){
    $scope.markers.forEach(function(value,key){value.setMap(null);});
    $scope.markers = [];
    if($scope.isInfoShown(info)){
      $scope.shownInfo = null;
      $scope.$storage.panToLocation = true;
      $scope.shownUser.info.forEach(function(value,key){$scope.showLocation(value);});
    }else{
      $ionicSideMenuDelegate.toggleLeft(false);
      $scope.$storage.panToLocation = false;
      $scope.map.panTo($scope.showLocation(info));
      $scope.shownInfo = info;
      $scope.infowindow = new google.maps.InfoWindow();  
      $scope.infowindow.setContent("<div class='row row-center'><label>"+info.date+"</label></div>");
      $scope.infowindow.open($scope.map, $scope.markers[0]);
    }
  }

  // switch menu view to see your position history and your personal informations ---------------------------------
  $scope.showMyHistory = function(){
    $scope.$storage.dataSearch.search = '';
    if($scope.$storage.islog && !$scope.$storage.isProfilView){
      $scope.$storage.isProfilView = true;
      $scope.onProfil({'search' : $scope.$storage.pseudo});
      $scope.markers.forEach(function(value,key){value.setMap(null);});
      $scope.markers = [];
      $timeout(function(){
        $scope.profillist.info.forEach(function(value,key){$scope.showLocation(value);});
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
    $scope.userlist = [];
    // $scope.$storage.dataSearch = {search : ""};
    $http.get($scope.$storage.url + '/users/getall').success(function(response){
      
      response.forEach(function(value,key){
        if(value._id != $scope.$storage.user_id){
          var data = {friends1 : $scope.$storage.user_id,friends2 : value._id};
          
          $http.post($scope.$storage.url + '/friends/isfriend',data).success(function(response){
            if(response.isfriend){
              
              $http.post($scope.$storage.url + '/coords/getall',{user_id: value._id}).success(function(res){
                if(res.length != 0){
                  var infoc = [];
                  for (var j=0; j<res.length; j++) {
                    infoc.push(res[j]); 
                  }
                  $scope.userlist.push({user: value,info: infoc,isfriend: response.isfriend}); 
                  // console.log(value.pseudo);
                  // console.log(infoc);
                }else{
                  // console.log(value.pseudo);
                  // console.log([]);
                  $scope.userlist.push({user: value,info: [],isfriend: response.isfriend}); 
                }               
              }).error(function(err, config) {console.log(config);});
            
            }
          }).error(function(err, config) {console.log(config);});
        
        }
      });
    }).error(function(err, config) {console.log(config);})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  
  };

  // Search fonctions -------------------------------------------------------------------------------------
  $scope.onSearchInput = function(data){
    $scope.userlist = [];
    $scope.shownUser = null;
    $http.post($scope.$storage.url + '/users/getbypseudo',{pseudo : data.search}).success(function(response){

      response.forEach(function(value,key){
        if(value._id != $scope.$storage.user_id){
          var data = {friends1 : $scope.$storage.user_id,friends2 : value._id};
          
          $http.post($scope.$storage.url + '/friends/isfriend',data).success(function(response){
            
            $http.post($scope.$storage.url + '/coords/getall',{user_id: value._id}).success(function(res){
              if(res.length != 0){
                var infoc = [];
                for (var j=0; j<res.length; j++) {
                  infoc.push(res[j]); 
                }
                $scope.userlist.push({user: value,info: infoc,isfriend: response.isfriend});
              }else{
                $scope.userlist.push({user: value,info: [],isfriend: response.isfriend});
              }
            }).error(function(err, config) {console.log(config);});
          
          }).error(function(err, config) {console.log(config);});
        
        }
      });
    }).error(function(err, config) {console.log(config);$scope.userlist = [];})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  
  };

  // search a specific location by date
  $scope.onSearchInputProfil = function(data){
    // console.log(data.search);
    // $scope.$broadcast('scroll.refreshStarted');
    $scope.shownInfo = null;

    $http.post($scope.$storage.url + '/coords/getbydate',{user_id: $scope.$storage.user_id, date: data.search}).success(function(res){
      if(res.length != 0){
        var infoc = [];
        for (var j=0; j<res.length; j++) {
          infoc.push(res[j]); 
        }
        $scope.profillist.info = infoc;
      }else{
        $scope.profillist.info = [];
      }
    }).error(function(err, config) {console.log(config);})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  
  };

  // equivalent of refresh friends list for coords in the profil view --------------------------------------
  $scope.onProfil = function(data){
    
    $http.post($scope.$storage.url + '/users/getbypseudo',{pseudo : data.search}).success(function(response){
      if(response.length == 1){

        $http.post($scope.$storage.url + '/coords/getall',{user_id: response[0]._id}).success(function(res){
          if(res.length != 0){
            var infoc = [];
            for (var j=0; j<res.length; j++) {
              infoc.push(res[j]); 
            }
            $scope.profillist = {user: response[0],info: infoc};
          }else{
            $scope.profillist = {user: response[0],info: []};
          }
        }).error(function(err, config) {console.log(config);})
      
      }
    }).error(function(err, config) {console.log(config);})
    .finally(function() {$scope.$broadcast('scroll.refreshComplete');});
  
  };

  $scope.onSearchCancel = function(data){data.search = '';$scope.reloadFriendsList();};
  $scope.onSearchCancelProfil = function(data){data.search = '';$scope.onProfil({'search' : $scope.$storage.pseudo});};
  

  // method used in line 336 and 591 --------------------------------------------------------------------------
  $scope.refreshMenuData = function(){
    if(!$scope.$storage.searchFocused){
      if($scope.$storage.isProfilView){
        $scope.onProfil({'search' : $scope.$storage.pseudo});
        $timeout(function(){
          for(var key in $scope.profillist.info){            
            if($scope.shownInfo !== undefined && $scope.shownInfo !== null){
              if($scope.profillist.info[key]._id === $scope.shownInfo._id){
                $scope.shownInfo = $scope.profillist.info[key];
              }
            }
          }
        },1000);
      }else{
        $scope.reloadFriendsList();
        $timeout(function(){
          $scope.userlist.forEach(function(value,key){
            if($scope.shownUser !== undefined && $scope.shownUser !== null){
              if(value.user._id === $scope.shownUser.user._id){
                $scope.shownUser = value;
              }
            }
          });
        },1000);
      }
    }else{
       if($scope.$storage.isProfilView){
        $scope.onSearchInputProfil($scope.$storage.dataSearch);
      }else{
        $scope.onSearchInput($scope.$storage.dataSearch);
      }
    }
  };

  // initialisation of the sidebar view
  if($scope.$storage.isProfilView){
    $scope.onProfil({'search' : $scope.$storage.pseudo});
    $scope.markers.forEach(function(value,key){value.setMap(null);});
    $scope.markers = [];
    $timeout(function(){
      $scope.profillist.info.forEach(function(value,key){$scope.showLocation(value);});
    },5000);
  }else
    $scope.reloadFriendsList();  

  // every 100 sec. reload the view of the sidebar menu
  var theInterval = $interval(function(){$scope.refreshMenuData();}.bind(this),30000);   

  // just show what we store -------------------------------------------------------------------------------
  $scope.showStorage = function($event){console.log($scope.$storage);$scope.openPopoverUrl($event);};

  // delete a position from backend ------------------------------------------------------------------------
  $scope.deleteInfo = function(info){
    $http.post($scope.$storage.url + '/coords/rm',{id : info._id})
    .success(function(response){
      console.log("deleted !");
      $scope.profillist.info.forEach(function(val,index,arr){
        if(val._id === info._id){
          console.log(val._id);
          arr.splice(index,1);
          $scope.closeRemoveInfo();
        }
      });
    }).error(function(err, config) {console.log(config);});
  };

  // add and remove friends methods ------------------------------------------------------------
  $scope.addFriend = function(user){
    // console.log(user);
    var data = {
      friends1 : $scope.$storage.user_id,
      friends2 : user.user._id
    };
    
    $http.post($scope.$storage.url + '/users/getbyid', {user_id: user.user._id}).success(function(response){
      
      $http.post($scope.$storage.url + '/friends/addfriend', data).success(function(response){
        console.log('Add Friend');   
        $scope.closeFriend();
        // $scope.refreshMenuData(); 
      }).error(function(err, config) {console.log(config);});
    
    }).error(function(err, config) {console.log(config);});
  };
  $scope.removeFriend = function(user){
    // console.log(user);
    var data = {
      friends1 : $scope.$storage.user_id,
      friends2 : user.user._id
    };
    
    $http.post($scope.$storage.url + '/friends/removeFriend', data).success(function(response){
      console.log('Remove Friend'); 
      $scope.closeRemoveFriend();
    }).error(function(err, config) {console.log(config);});
    // $timeout(function() {$scope.refreshMenuData(); }, 1000);

  };
})

// .controller('PlaylistsCtrl', function($scope) {
//   $scope.playlists = [
//     { title: 'Reggae', id: 1 },
//     { title: 'Chill', id: 2 },
//     { title: 'Dubstep', id: 3 },
//     { title: 'Indie', id: 4 },
//     { title: 'Rap', id: 5 },
//     { title: 'Cowbell', id: 6 }
//   ];
// })

// .controller('PlaylistCtrl', function($scope, $stateParams) {
// });