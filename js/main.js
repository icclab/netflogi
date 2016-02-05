angular.module('app', ['ui.bootstrap', 'ngRoute'])

.config(function($routeProvider) {

  $routeProvider
    .when('/', {
      controller:'HomeController',
      templateUrl:'html/home.html',
    })
    .when('/service-function-chaining', {
      controller:'ServiceFunctionChainingController',
      templateUrl:'html/service-function-chaining.html',
    })
    .when('/connection', {
      controller:'ConnectionController',
      templateUrl:'html/connection.html',
    })
    .when('/bridges', {
      controller:'BridgesController',
      templateUrl:'html/bridges.html',
    })
    .when('/topology', {
      controller:'TopologyController',
      templateUrl:'html/topology.html',
    })
    .when('/logs', {
      controller:'LogsController',
      templateUrl:'html/logs.html',
    })
    .otherwise({
      redirectTo:'/'
    });
})
.service('netfloc', function($http) {
  var that = this;
  var configurated = false;
  var settings = {
    url: {
      createServiceChain: 'admin:admin@127.0.0.1:8181/restconf/operations/netfloc:create-service-chain'
    }
  };
  this.config = function(options) {
    if (configurated) { return that; }
    _.extend(settings, options); configurated = true;
    return that;
  };
  this.createServiceChain = function(neutronPorts, fn) {
    $http({
      method: 'POST',
      url: settings.url,
      data: {
        "input": {
          "neutron-ports": neutronPorts
        }
      }
    }).then(fn);
    return that;
  };
})
.controller('MainController', function($scope) {
  $scope.menu=[
    {href:"#/topology" , label:"Topology" },
    {href:"#/logs" , label:"Logs" }
  ];
  $scope.menuService = {label:"Service" , menu: [{href:"#/service-function-chaining" , label:"Service Function Chaining"} , {href:"#/chainpattern" , label:"Chain Pattern" }]};
  $scope.menuConnection = {label:"Connection" , menu: [{href:"#/flowpath" , label:"Flow Path" } , {href:"#/flowpattern" , label:"Flow Pattern" }] };
  $scope.menuBridges = {label:"Bridges" , menu: [{href:"#/subbridges" , label:"Bridges" } , {href:"#/bridgepattern" , label:"Bridge Pattern" }]};
  $scope.menuTopology = {};
  $scope.menuLogs = {};
  console.log("MainController");
})
.controller('HomeController', function($scope) {
  console.log("HomeController");
  $scope.introduction="blabla";
})
.controller('ServiceFunctionChainingController', function($scope, netfloc) {
  $scope.neutronPorts = "";
  $scope.createServiceChain = function() {
    netfloc.createServiceChain($scope.neutronPorts, function() {});
  }
  console.log("ServiceFunctionChainingController");
})
.controller('ConnectionController', function() {
  console.log("ConnectionController");

})
.controller('BridgesController', function() {
  console.log("BridgesController");

})
.controller('TopologyController', function() {
  console.log("TopologyController");

})
.controller('LogsController', function() {
  console.log("LogsController");

})
