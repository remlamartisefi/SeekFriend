// var url = 'http://mlollo.rmorpheus.enseirb.fr:8080'
// var url = 'http://localhost:8080'
var url = 'http://b96e1293.ngrok.io'

angular.module('starter.factories', [])

.factory('reloadFriendsListFactory1',function($http){
  return {
    factory: function(value){
      return $http.post(url + '/coords/getall',{user_id: value._id})
      .success(function(res){
        return res;
      }).error(function(err, config) {console.log(config);return [];});
    }
  };
})
.factory('reloadFriendsListFactory',function($http,reloadFriendsListFactory1){
  return {
    factory: function(){
      return $http.get(url + '/users/getall')
      .success(function(response){
        return response;
      }).error(function(err, config) {console.log(config);return [];});
    }
  };
})
.factory('onSearchInputFactory1',function($http){
  return {
    factory: function(value){
      return $http.post(url + '/coords/getall',{user_id: value._id})
      .success(function(res){
        if(res.length != 0){
          var info = [];
          for (var j=0; j<res.length; j++) {
            info.push(res[j]); 
          }
          return info
        }
        return [];
      }).error(function(err, config) {console.log(config);});
    }
  };
})
.factory('onSearchInputFactory',function($http,onSearchInputFactory1){
  return {
    factory: function(data){
      return $http.post(url + '/users/getbypseudo',{pseudo : data.search})
      .success(function(response){
        var userlist = [];
        response.forEach(function(value,key){
          userlist.push({
            _user: value,
            _info: onSearchInputFactory1.factory(value)
          });
        });
        return userlist;
      }).error(function(err, config) {console.log(config);return [];});
    }
  };
})
.factory('onSearchInputProfilFactory',function($http){
  return {
    factory: function(data){
      return $http.post(url + '/coords/getbydate',{user_id: $scope.$storage.user_id, date: data.search})
      .success(function(res){
        if(res.length != 0){
          var info = [];
          for (var j=0; j<res.length; j++) {
            info.push(res[j]); 
          }
          return info
        }
        return [];
      }).error(function(err, config) {console.log(config);return [];});
    }
  };
})
.factory('onProfilFactory1',function($http){
  return {
    factory: function(response){
      return $http.post(url + '/coords/getall',{user_id: response._id})
      .success(function(res){
        if(res.length != 0){
          var info = [];
          for (var j=0; j<res.length; j++) {
            info.push(res[j]); 
          }
          return info;
        }
        return [];
      }).error(function(err, config) {console.log(config);return [];});
    }
  };
})
.factory('onProfilFactory',function($http,onProfilFactory1){
  return {
    factory: function(data){
      return $http.post(url + '/users/getbypseudo',{pseudo : data.search})
      .success(function(response){
        if(response.length == 1){
          var profillist = {
            _user: response[0],
            _info: onProfilFactory1.factory(value)
          };
          return profillist;
        }
        return {};
      }).error(function(err, config) {console.log(config);return {};});
    }
  };
});

    