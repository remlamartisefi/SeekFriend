
function GeolocationSync(Application){

  var existLatLong = Application.getPosition();
  if(existLatLong === null){
    $ionicLoading.show({
      templateUrl: 'templates/sync.html',
      scope: $scope
    });

    if(window.cordova !== undefined){
      if($cordovaDevice.getDevice().platform === "Android"){
        isGpsEnabled();
        var intervalPromisse = $interval(function(){
            isGpsEnabled();
        },4000);
      }
      else{
        getLocation();
      }
    }else{
      getLocation();
    }
  }

  function isGpsEnabled() {
    var gpsEnabled = window.plugins.locationAndSettings;
    gpsEnabled.isGpsEnabled(function(result) {
      if (result === false) {
         if($scope.openConfigLocation === false)
            switchToLocationSettings();
      }
      else{
        $interval.cancel(intervalPromisse);
        getLocation();
      }
    }, function() {
      alert("error");
    });
  }

  function switchToLocationSettings() {
    var configLocation = window.plugins.locationAndSettings;
    configLocation.switchToLocationSettings(function(result) {
      if(result){
        $scope.openConfigLocation = true;
      }
    }, function() {
      alert("error");
    });
  }

  function getLocation(){

    var watchOptions = {
      frequency : 100000,
      enableHighAccuracy: true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        console.log(err);
      },
      function(position) {
        var lat  = position.coords.latitude;
        var lng = position.coords.longitude;
        Application.setPosition([lat, lng]);
        $ionicLoading.hide();
    });
  }
}
