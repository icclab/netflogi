angular.module('app', ['ui.bootstrap', 'ngRoute'])

.config(function($routeProvider) {

  $routeProvider
    .when('/', {
      controller:'HomeController',
      templateUrl:'html/home.html',
    })
    .when('/service', {
      controller:'ServiceController',
      templateUrl:'html/service.html',
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
.controller('MainController', function($scope) {
  $scope.menu=[
    {href:"#/connection" , label:"Connection" },
    {href:"#/bridges" , label:"Bridges" },
    {href:"#/topology" , label:"Topology" },
    {href:"#/logs" , label:"Logs" }
  ];
  $scope.menuService = {label:"Service" , menu: [{href:"#/connection" , label:"Connection" }]};

  console.log("MainController");
})
.controller('HomeController', function($scope) {
  console.log("HomeController");
  $scope.introduction="blabla";
})
.controller('ServiceController', function() {
  console.log("ServiceController");
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



