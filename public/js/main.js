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
			serviceChain: '/api/service-chain',
			neutronPorts: '/api/neutron-ports'
		}
	};
	this.config = function(options) {
		if (configurated) { return that; }
		_.extend(settings, options); configurated = true;
		return that;
	};
	this.createServiceChain = function(neutronPorts) {
		return $http({
			method: 'POST',
			url: settings.url.serviceChain,
			data: {
				"input": {
					"neutron-ports": neutronPorts
				}
			}
		});
	};
	this.getNeutronPorts = function() {
		return $http({
			method: "GET",
			url: settings.url.neutronPorts
		});
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
	console.log("ServiceFunctionChainingController");

	$scope.fetchNeutronPorts = function() {
		netfloc.getNeutronPorts().then(function(ports){
			console.log("neutron-ports", ports.data.ports);
			$scope.neutronPorts = _.map(ports.data.ports, function(port) {
				port.selectedOrder = 0;
				port.dropDownToggled = function(open) {
					console.log("toggled", this, open);
				};
				return port;
			});
		});
	};
	$scope.fetchNeutronPorts();

	var clearNeutronPorts = function() {
		$scope.neutronPorts = _.map($scope.neutronPorts, function(port) {
			console.log(port);
			port.selectedOrder = 0;
			return port;
		});
	};

	$scope.getServiceChain = function(ports) {
		return  _.map(_.sortBy(_.filter(ports, function(port){
			return port.selectedOrder != 0;
		}), 'selectedOrder'), function(port){
			return port.id;
		});
	};

	$scope.chainIsValid = function(ports, maxChainOrder) {
		return $scope.getServiceChain(ports).length >= 4
		&& maxChainOrder.length == 1
		&& maxChainOrder[0] == 0;
	};

	$scope.maxChainOrderIsValid = function(nr) {
		return nr >= 4 && nr % 2 == 0;
	};

	$scope.maxChainOrderNr = 0;
	$scope.applyMaxChainOrder = function() {
		clearNeutronPorts();
		$scope.maxChainOrder = Array.apply(null, {length: $scope.maxChainOrderNr+1}).map(Number.call, Number);
		console.log("apply maxChainOrder", $scope.maxChainOrder);
	};

	$scope.maxChainOrder = [null];
	$scope.createServiceChain = function(ports) {
		if (!$scope.chainIsValid(ports, $scope.maxChainOrder)) {
			console.log("chain is not valid.");
			return;
		}
		var serviceChainString = $scope.getServiceChain(ports).join(",");
		console.log("serviceChainString:", serviceChainString);
		netfloc.createServiceChain(serviceChainString)
			.then(function(data) {
				$scope.fetchNeutronPorts();
				console.log(data);
			})
			.catch(function(err) {
				console.error(err);
			});
	};

	$scope.selectOrder = function(port, order) {
		port.selectedOrder = order;
		$scope.maxChainOrder = _.filter($scope.maxChainOrder, function(chainOrder) {
			return chainOrder != order;
		});
		console.log("select order for port", order, port);
	};
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
