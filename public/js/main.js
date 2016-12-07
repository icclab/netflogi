angular.module('app', ['ui.bootstrap', 'ngRoute'])

.config(function($routeProvider) {

	$routeProvider
	.when('/', {
		controller:'HomeController',
		templateUrl:'html/home.html',
	})
	.when('/services', {
		controller:'ServicesController',
		templateUrl:'html/services.html',
	})
	.when('/service-function-chaining', {
		controller:'ServiceFunctionChainingController',
		templateUrl:'html/service-function-chaining.html',
	})
	.when('/created-sfcs', {
		controller:'CreatedSfcsController',
		templateUrl:'html/created-sfcs.html',
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
		templateUrl:'html/chainpatterns.hnetfloctml',
	})
	.when('/subbridges', {
		controller:'SubBridgesController',
		templateUrl:'html/subbridges.html',
	})
	.when('/networkpath', {
		controller:'NetworkPathController',
		templateUrl:'html/networkpath.html',
	})
	.when('/flowpatterns', {
		controller:'FlowPatternController',
		templateUrl:'html/flowpatterns.html',
	})
	.when('/monitoring', {
		controller:'MonitoringController',
		templateUrl:'html/monitoring.html',
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
			serviceChainDelete: '/api/service-chain-delete',
			neutronPorts: '/api/neutron-ports',
			novaServers: '/api/nova-servers',
			netflocNodes: '/api/netfloc-nodes',
			netflocFlows: '/api/netfloc-flows'
		}
	};
	this.config = function(options) {
		if (configurated) { return that; }
		_.extend(settings, options); configurated = true;
		return that;
	};
	this.getServiceChains = function() {
		return $http({
			method: 'GET',
			url: settings.url.serviceChain,
		});
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
	this.deleteServiceChain = function(id) {
		console.log("deleting chain ", id);
		return $http({
			method: 'POST',
			url: settings.url.serviceChainDelete,
			data: {
				"input": {
					"service-chain-id": id
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
	this.getNovaServers = function() {
		return $http({
			method: "GET",
			url: settings.url.novaServers
		});
	};
	this.getServiceChains = function() {
		return $http({
			method: 'GET',
			url: settings.url.serviceChain,
		});
	};
	this.getNeutronPorts = function() {
		return $http({
			method: "GET",
			url: settings.url.neutronPorts
		});
	};
	this.getNodes = function() {
		return $http({
			method: "GET",
			url: settings.url.netflocNodes,
		});
	};
	this.getFlows = function(node) {
	    console.log("getting flows");
		return $http({
			method: "GET",
			url: settings.url.netflocFlows+"/"+node,
		});
	};
})
.controller('MainController', function($scope, $location) {
	console.log('currentroute', $location.$$path);
	$scope.main={};
	$scope.main.hasnavigation = true;
	$scope.menu=[
	{href:"#/topology" , label:"Topology" },
	{href:"#/logs" , label:"Logs" }
	];
	$scope.menuService = {label:"Service" , menu: [{href:"#/service-function-chaining" , label:"Service Function Chaining"} , {href:"#/created-sfcs" , label:"Created SFCs" }, {href:"#/chainpattern" , label:"Chain Pattern" }, {href:"#/monitoring" , label:"Monitoring"}]};
	$scope.menuConnection = {label:"Connection" , menu: [{href:"#/networkpath" , label:"Network Path" } , {href:"#/flowpatterns" , label:"Flow Pattern" }] };
	$scope.menuBridges = {label:"Bridges" , menu: [{href:"#/subbridges" , label:"Bridges" } , {href:"#/bridgepattern" , label:"Bridge Pattern" }]};
	$scope.menuTopology = {};
	$scope.menuLogs = {};
	console.log("MainController");
})
.controller('HomeController', function($scope) {
	$scope.main.hasnavigation = false;
	console.log("HomeController");
	$scope.introduction="NETwork FLOws for Clouds (Netfloc) is a framework for datacenter network programming. It is comprised of set of tools and libraries packed as Java bundles that interoperate with the OpenDaylight controller. Netfloc exposes REST API abstractions and Java interfaces for network programmers to enable optimal integration in cloud datacenters and fully SDN-enabled end-to-end management of OpenFlow enabled switches. For further information please follow this link : http://netfloc.readthedocs.org/en/latest/ ";
})
.controller('ServiceFunctionChainingController', function($scope, netfloc) {
	$scope.main.hasnavigation = true;
	console.log("ServiceFunctionChainingController");
	$scope.introductionservicefunctionchaining="The function Service Function Chaining allows to get the number of Neutron Ports needed.";

	$scope.fetchNeutronPorts = function() {
		netfloc.getNeutronPorts().then(function(ports){
			console.log("neutron-ports", ports, ports.data.ports);
			$scope.neutronPorts = _.map(ports.data.ports, function(port) {
				port.selectedOrder = 0;
				port.dropDownToggled = function(open) {
					console.log("toggled", this, open);
				};
				port.ip = _.map(port.fixed_ips, function(fixed_ip){
					return fixed_ip.ip_address;
				}).join(",");
				return port;
			});
		});
	};
	$scope.fetchNeutronPorts();

	$scope.fetchServiceChains = function() {
		netfloc.getServiceChains().then(function(chains){
			$scope.chains = _.map(chains.data.chains.chain, function(chain){
				chain.selected = false;
				chain.port = _.map(chain["chain-connection-point"], function(port){
					return port;
				}).join(",");
				console.log("Service chain ", chain);
				return chain;
			});
		});
	};
	$scope.fetchServiceChains();

	$scope.fetchNovaServers = function() {
		netfloc.getNovaServers().then(function(servers){
			console.log("nova-servers", servers, servers.data.servers);
			$scope.novaServers = _.map(servers.data.servers, function(server){
				server.selected = false;
				return server;
				console.log("Nova server ", server);
			});
		});
	};
	$scope.fetchNovaServers();

	$scope.deleteSelected = function() {
		_.each(_.filter($scope.chains, function(chain) {
			return chain.selected === true;
		}), function(chain) {
			console.log("Chain to be deleted ", chain.id);
			netfloc.deleteServiceChain(chain.id).then(function() {
				$scope.showMessage = true;
			  	$scope.alertClass = "alert-success";
					$scope.refresh();
					$scope.reload();
			  	$scope.alertTitle = "Success"; $scope.alertMessage = "Chain successfully deleted";
			  	netfloc.getServiceChains();
			})
			.catch(function(err) {
				$scope.showMessage = true;
			  	$scope.alertClass = "alert-danger";
			  	$scope.alertTitle = "Error"; $scope.alertMessage = "Error deleting the chain";
				console.error(err);
			});
		});
	};

	$scope.toggleSelect = function(){
		$scope.serviceChains = _.map($scope.serviceChains, function(serviceChain){
			serviceChain.selected = $scope.selectAll;
			return serviceChain;
		});
	};
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
		return $scope.getServiceChain(ports).length >= 2
		&& maxChainOrder.length == 1
		&& maxChainOrder[0] == 0;
	};

	$scope.maxChainOrderIsValid = function(nr) {
		return nr >= 2 && nr % 1 == 0;
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
				console.log("neuron ports ", data);
				$scope.showMessage = true;
			  $scope.alertClass = "alert-success";
			  $scope.alertTitle = "Success"; $scope.alertMessage = "Your Chain has been successfully created";
			})
			.catch(function(err) {
				$scope.showMessage = true;
			  $scope.alertClass = "alert-danger";
			  $scope.alertTitle = "Error"; $scope.alertMessage = "Something went wrong";
				console.error(err);
			});
	};
	$scope.selectOrder = function(port, order) {
		if(port.selectedOrder !== 0){
			$scope.maxChainOrder.push(port.selectedOrder);
		}
		port.selectedOrder = order;
		$scope.maxChainOrder = _.filter($scope.maxChainOrder, function(chainOrder) {
			return chainOrder !== order || chainOrder === 0;
		});
		// sortieren reihenfolge
		console.log("select order for port", order, port);
	};
})
.controller('ServicesController', function() {
	console.log("ServicesController");
})
.controller('CreatedSfcsController', function($scope) {
	console.log("CreatedSfcsController");
	$scope.introductioncreatedsfcs="Below, all the already created Service Function Chains are listed. If you haven't created a Service Function Chain yet, please create one now.";

})
.controller('ChainPatternController', function($scope) {
	console.log("ChainPatternController");
	$scope.introductionchainpattern="In the Chain Patterns section of the SFC service, the user will be offered the possibility to Create / Enable / Disable different chain patterns. Patterns are automatically applied to new service chains and generate the Open Flow messages for each of the bridges in the chain.";

})
.controller('ConnectionController', function($scope) {
	console.log("ConnectionController");
})
.controller('NetworkPathController', function($scope) {
	console.log("NetworkPathController");
	$scope.introductionnetworkpath="The Network Graph creates Network Paths between Host Ports (provided by the Neutron API) to enable connection oriented flow programming. The Network Graph will currently only provide the shortest Network Path between two hosts by performing a BFS. A Network Path is a dynamic view onto a host-to-host connection and is not explicitly bound to OVS devices.";

})
.controller('FlowPatternController', function($scope) {
	console.log("FlowPatternController");
	$scope.introductionflowpattern="Flow Patterns are a parameterized structure which can be applied on Network Paths and are thus also segmented into source, destination and aggregation parts. Flow Patterns which are applied to Network Paths are dynamically maintained by Netfloc as long as the respective host-to-host connection is achievable.";
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
.controller('MonitoringController', function($scope, netfloc) {
	$scope.main.hasnavigation = true;
	console.log(" monitoringController");
	$scope.introductionmonitoring="SDN monitoring";

	$('.modal').on('show.bs.modal', function(event) {
	    var idx = $('.modal:visible').length;
	    $(this).css('z-index', 1040 + (10 * idx));
	});
	$('.modal').on('shown.bs.modal', function(event) {
	    var idx = ($('.modal:visible').length) -1; // raise backdrop after animation.
	    $('.modal-backdrop').not('.stacked').css('z-index', 1039 + (10 * idx));
	    $('.modal-backdrop').not('.stacked').addClass('stacked');
	});

		$scope.fetchNodes = function() {
			netfloc.getNodes().then(function(nodes){
				console.log("netfloc-nodes", nodes.data.nodes);
				$scope.nodes = _.map(nodes.data.nodes.node, function(node){
					node.selected = false;
					console.log("Netfloc node ", node);
					return node;
				});
			});
		};
		$scope.fetchNodes();

		$scope.showPorts = function(node) {
			ports = node["node-connector"];
			$scope.ports = _.map(node["node-connector"], function(port){
				port.node_id = node.id;
				return port;
			});
		};

		$scope.showPortsDetail = function(selectedPort) {
			p = selectedPort["opendaylight-port-statistics:flow-capable-node-connector-statistics"];
			p.id = selectedPort.id;
			$scope.Math = window.Math;
			$scope.portDetails = p;
		};

		$scope.showTables = function(node) {
			tables = node["flow-node-inventory:table"];
			console.log("Show tables node ", tables);
			$scope.Math = window.Math;
			$scope.tables = _.map(node["flow-node-inventory:table"], function(table){
			 	return table;
			});
		};

		$scope.showFlows = function(node) {
			netfloc.getFlows(node).then(function(flows){
				$scope.flows = _.map(flows.data["flow-node-inventory:table"][0].flow, function(flow){
					return flow;
				});
			});
		};

		$scope.showFlowId = function(flow) {
			flowId = flow.id;
			$scope.flowId = flowId;
		};

		$scope.showFlowMatch = function(flow) {
			flowMatch = flow.match;
			$scope.flowMatch = flowMatch;
		};

		$scope.showFlowInstructions = function(flow) {
			$scope.instructions = _.map(flow.instructions.instruction[0]["apply-actions"]["action"], function(instruction){
				return instruction;
			});
		};

	})
