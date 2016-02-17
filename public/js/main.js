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
    .when('/bridgepattern', {
      controller:'BridgePatternController',
      templateUrl:'html/bridgepatterns.html',
    })
    .when('/chainpattern', {
      controller:'ChainPatternController',
      templateUrl:'html/chainpatterns.html',
    })
    .when('/subbridges', {
      controller:'SubBridgesController',
      templateUrl:'html/subbridges.html',
    })
    .when('/flowpath', {
      controller:'FlowPathController',
      templateUrl:'html/flowpath.html',
    })
    .when('/flowpatterns', {
      controller:'FlowPatternController',
      templateUrl:'html/flowpatterns.html',
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
      createServiceChain: '/api/create-service-chain'
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
  this.getNeutronPorts = function(fn) {
    var data = [
      { id: "1c7811dc-e0b1-4d1e-9089-c203df328157", macAddress: "fa:16:3e:47:47:00", ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.2"}]},
      { id: "38aa2be8-dec7-49b3-94e6-805bb23c30fd", macAddress: "fa:16:3e:a0:25:f2", ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.4"}]},
      { id: "3b842df8-e92a-4d53-b394-fc575d8d37e5", macAddress: "fa:16:3e:5d:02:57", ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.3"}]},
      { id: "3cac74fd-f24d-4b40-8344-1a86af85113e", macAddress: "fa:16:3e:bb:a4:ca", ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.1"}]},
      { id: "78058861-9079-4b9e-925f-81f4a0ac3e27", macAddress: "fa:16:3e:62:b4:f2", ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.7"}]},
      { id: "7fc1733c-f8d3-47cf-b755-0b08374a0e55", macAddress: "fa:16:3e:bb:1f:e0", ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.4"}]},
      { id: "8075c307-4df9-4421-b65b-b2d871f83f56", macAddress: "fa:16:3e:3d:36:b6", ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.3"}]},
      { id: "87b30d9c-e895-42c0-8ea1-09c5087c2207", macAddress: "fa:16:3e:79:75:3f", ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.2"}]},
      { id: "96ccf08f-6aa1-4b88-b853-4dfd46853a22", macAddress: "fa:16:3e:e1:2c:58", ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.5"}]}
    ];
    fn(data);
  };
})
.controller('MainController', function($scope) {
  $scope.menu=[
    {href:"#/topology" , label:"Topology" },
    {href:"#/logs" , label:"Logs" }
  ];
  $scope.menuService = {label:"Service" , menu: [{href:"#/service-function-chaining" , label:"Service Function Chaining"} , {href:"#/chainpattern" , label:"Chain Pattern" }]};
  $scope.menuConnection = {label:"Connection" , menu: [{href:"#/flowpath" , label:"Flow Path" } , {href:"#/flowpatterns" , label:"Flow Pattern" }] };
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
  netfloc.getNeutronPorts(function(ports){
    $scope.neutronPorts = _.map(ports, function(port) {
      port.selectedOrder = 0;
      port.dropDownToggled = function(open) {
        console.log("toggled", this, open);
      };
      return port;
    });
  });
  $scope.maxChainOrderNr = 0;
  $scope.applyMaxChainOrder = function() {
    $scope.maxChainOrder = Array.apply(null, {length: $scope.maxChainOrderNr+1}).map(Number.call, Number);
    console.log("new maxChainOrder", $scope.maxChainOrder);
  };
  $scope.maxChainOrder = [null];
  $scope.createServiceChain = function() {
    var serviceChain = _.filter($scope.neutronPorts, function(port){
       return port.selectedOrder != 0;
         });

    console.log("filtered:", serviceChain);
    serviceChain = _.sortBy(serviceChain, 'selectedOrder');
   console.log("sorted:", serviceChain);

    serviceChain = _.map(serviceChain, 'selectedOrder');
    console.log("chained:", serviceChain);

    netfloc.createServiceChain(serviceChain, function() {});
  }//
  console.log("ServiceFunctionChainingController");

  $scope.selectOrder = function(port, order) {
    port.selectedOrder = order;
    $scope.maxChainOrder = _.filter($scope.maxChainOrder, function(chainOrder) {
      return chainOrder != order;
    });
    console.log("select order for port", order, port);
  }
})
.controller('ChainPatternController', function() {
  console.log("ChainPatternController");

})
.controller('ConnectionController', function() {
  console.log("ConnectionController");

})
.controller('FlowPathController', function() {
  console.log("FlowPathController");

})
.controller('FlowPatternController', function() {
  console.log("FlowPatternController");

})
.controller('BridgesController', function() {
  console.log("BridgesController");

})
.controller('SubBridgesController', function() {
  console.log("SubBridgesController");

})
.controller('BridgePatternController', function() {
  console.log("BridgePatternController");

})
.controller('TopologyController', function() {
  console.log("TopologyController");

})
.controller('LogsController', function() {
  console.log("LogsController");

})
