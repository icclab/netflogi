var _ = require("underscore"),
	util = require("util"),
	config = {},
	http = require("http"),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	prompt = require('prompt');

app.use(express.static('public'));
app.use(bodyParser.json());

var neutronPorts = [
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157", mac_address: "fa:16:3e:47:47:00", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.2"},{"subnet_id": "50d0g739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.14.12.4"}]},
	{ id: "38aa2be8-dec7-49b3-94e6-805bb23c30fd", mac_address: "fa:16:3e:a0:25:f2", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.4"}]},
	{ id: "3b842df8-e92a-4d53-b394-fc575d8d37e5", mac_address: "fa:16:3e:5d:02:57", fixed_ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.3"}]},
	{ id: "3cac74fd-f24d-4b40-8344-1a86af85113e", mac_address: "fa:16:3e:bb:a4:ca", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.1"}]},
	{ id: "78058861-9079-4b9e-925f-81f4a0ac3e27", mac_address: "fa:16:3e:62:b4:f2", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.7"}]},
	{ id: "7fc1733c-f8d3-47cf-b755-0b08374a0e55", mac_address: "fa:16:3e:bb:1f:e0", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.4"}]},
	{ id: "8075c307-4df9-4421-b65b-b2d871f83f56", mac_address: "fa:16:3e:3d:36:b6", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.3"}]},
	{ id: "87b30d9c-e895-42c0-8ea1-09c5087c2207", mac_address: "fa:16:3e:79:75:3f", fixed_ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.2"}]},
	{ id: "96ccf08f-6aa1-4b88-b853-4dfd46853a22", mac_address: "fa:16:3e:e1:2c:58", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.5"}]}
];

var serviceChains = [
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157", neutroPortOrder: "test"},
	{ id: "38aa2be8-dec7-49b3-94e6-805bb23c30fd", neutroPortOrder: "test1"},
	{ id: "3b842df8-e92a-4d53-b394-fc575d8d37e5", neutroPortOrder: "test2"},
	{ id: "3cac74fd-f24d-4b40-8344-1a86af85113e", neutroPortOrder: "test3"},
	{ id: "78058861-9079-4b9e-925f-81f4a0ac3e27", neutroPortOrder: "test4"},
	{ id: "7fc1733c-f8d3-47cf-b755-0b08374a0e55", neutroPortOrder: "test5"},
	{ id: "8075c307-4df9-4421-b65b-b2d871f83f56", neutroPortOrder: "test6"},
	{ id: "87b30d9c-e895-42c0-8ea1-09c5087c2207", neutroPortOrder: "test7"},
	{ id: "96ccf08f-6aa1-4b88-b853-4dfd46853a22", neutroPortOrder: "test8"}
];

app.get("/api/service-chain", function(req, res){
	var chains = "";
	var getRequest = http.request({
		host: config.netflocHost,
		port: config.netflocPort,
		auth: config.netflocAuth,
		method: "GET",
		path: "/restconf/operational/netfloc:chains/",
		headers: {
			"contentType": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Cache-Control, Origin, Authorization, Content-Type, X-Requested-With",
			"Access-Control-Allow-Methods": "GET, PUT, POST"
      	}
	}, function(netflocRes) {
		console.log("netfloc response");
		netflocRes.on('data', function (chunk) {
			chains += chunk;
			console.log("Netfloc chains ", chains);
      	});
      	netflocRes.on("error", function(err) {
      		console.log("neutron error:res", err);
      		res.status(500).send(err);
      	});
      	netflocRes.on("end", function() {
      		res.status(200).send(chains);
      	});
	})
	getRequest.on("error", function(err) {
		console.log("netfloc error:req", err);
		res.send(err);
	});
	getRequest.end();
});

app.post("/api/service-chain-delete", function(req, res) {
	console.log("DELETE /api/service-chain-delete ", req.body.input['service-chain-id']);
	var postRequest = http.request({
		host: config.netflocHost,
		port: config.netflocPort,
		auth: config.netflocAuth,
		method: "POST",
		path: "/restconf/operations/netfloc:delete-service-chain",
		headers: {
			'Content-Type': 'application/json',
      }
	}, function(netflocRes) {
		netflocRes.on('data', function (data) {
			console.log('Response: ' + data);
      	});
      	netflocRes.on("error", function(err) {
      		console.log("netfloc error:res", err);
      		res.status(500).send(err);
      	});
      	netflocRes.on("end", function() {
      		res.status(200).send("Success");
      	});
	})
	postRequest.on("error", function(err) {
		console.log("netfloc error:req", err);
		res.status(400).send(err);
	});
	postRequest.write(JSON.stringify(req.body));
	postRequest.end();
});

app.get("/api/service-chain/:id", function(req, res) {
	console.log("GET /api/service-chain/" + req.params.id, req.body);

	res.status(200).send(_.find(serviceChains, function(serviceChain) {
		return req.params.id === serviceChain.id;
	}));
});

app.post("/api/service-chain", function(req, res) {
	console.log("POST /api/service-chain", req.body);
	var serviceChainString = "";
	var postRequest = http.request({
		host: config.netflocHost,
		port: config.netflocPort,
		auth: config.netflocAuth,
		method: "POST",
		path: "/restconf/operations/netfloc:create-service-chain",
		headers: {
			'Content-Type': 'application/json',
      	}
	}, function(netflocRes) {
		console.log("netfloc response");
		netflocRes.on('data', function (chunk) {
			console.log('Response: ' + chunk);
			serviceChainString += chunk;
      	});
      	netflocRes.on("error", function(err) {
      		console.log("netfloc error:res", err);
      		res.status(500).send(err);
      	});
      	netflocRes.on("end", function() {
      		res.status(200).send(serviceChainString);
      	});
	})
	postRequest.on("error", function(err) {
		console.log("netfloc error:req", err);
		res.status(400).send(err);
	});
	postRequest.write(JSON.stringify(req.body));
	postRequest.end();
});

var keystone = {
    "auth": {
        "passwordCredentials": {
            "password": "6d12c209c69946ce",
            "username": "admin"
        },
        "tenantName": "admin"
    }
};

var token, tenant_id;

var getToken = function() {
	var tokenString = "";
	var postRequest = http.request({
		host: config.keystoneHost,
		port: config.keystonePort,
		method: "POST",
		path: "/v2.0/tokens",
		headers: {
			'Content-Type': 'application/json',
		}
	}, function(keyStoneRes) {
		console.log("keystone response");
		keyStoneRes.on('data', function (chunk) {
			tokenString += chunk;
      	});
      	keyStoneRes.on("error", function(err) {
      		console.log("keystone error:res", err);
      	});
      	keyStoneRes.on("end", function() {
      		token = JSON.parse(tokenString);
			console.log("keystone token", token);
			tenant_id = token.access.token.tenant.id;
			console.log("tenant id", tenant_id);
      	});
	})
	postRequest.on("error", function(err) {
		console.log("keystone error:req", err);
	});
	postRequest.write(JSON.stringify({"auth": {
        "passwordCredentials": {
            "password": config.keystonePass,
            "username": config.keystoneUser
        },
        "tenantName": config.keystoneTenant
    }}));
	postRequest.end();
};

app.get("/api/neutron-ports", function(req, res) {
	console.log("/api/neutron-ports", req.body);
	if (_.isUndefined(token)){
		console.log("sending mock data", { ports: neutronPorts });
		res.status(200).send({ ports: neutronPorts });
		return;
	}
	var neutronPortList = "";
	var getRequest = http.request({
		host: config.neutronHost,
		port: config.neutronPort,
		//auth: config.auth,
		method: "GET",
		path: "/v2.0/ports",
		headers: {
			'X-Auth-Token': token.access.token.id
      	}
	}, function(neutronRes) {
		console.log("neutron response");
		neutronRes.on('data', function (chunk) {
			neutronPortList += chunk;
      	});
      	neutronRes.on("error", function(err) {
      		console.log("neutron error:res", err);
      		res.status(500).send(err);
      	});
      	neutronRes.on("end", function() {
      		res.status(200).send(neutronPortList);
      	});
	})
	getRequest.on("error", function(err) {
		console.log("neutron error:req", err);
		res.send(err);
	});
	console.log("Neutron get ports request ", getRequest);
	getRequest.end();
});

app.get("/api/nova-servers", function(req, res) {
	console.log("/api/nova-servers", req.body);
	var novaServerList = "";
	var getRequest = http.request({
		host: config.novaHost,
		port: config.novaPort,
		method: "GET",
		path: "/v2/"+tenant_id+"/servers",
		headers: {
			'X-Auth-Token': token.access.token.id
      	}
	}, function(novaRes) {
		novaRes.on('data', function (chunk) {
			novaServerList += chunk;
			console.log("nova response ", novaServerList);
      	});
      	novaRes.on("error", function(err) {
      		console.log("neutron error:res", err);
      		res.status(500).send(err);
      	});
      	novaRes.on("end", function() {
      		res.status(200).send(novaServerList);
      	});
	})
	getRequest.on("error", function(err) {
		console.log("neutron error:req", err);
		res.send(err);
	});
	console.log("Nova get servers request ", getRequest);
	getRequest.end();
});

app.get("/api/netfloc-nodes", function(req, res) {
	console.log("/api/netfloc-nodes");
	var nodes = "";
	var getRequest = http.request({
		host: config.netflocHost,
		port: config.netflocPort,
		auth: config.netflocAuth,
		method: "GET",
		path: "/restconf/operational/opendaylight-inventory:nodes",
		headers: {
			"contentType": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
			"Access-Control-Allow-Methods": "GET, PUT, POST"
      	}
	}, function(netflocRes) {
		console.log("netfloc response");
		netflocRes.on('data', function (chunk) {
			nodes += chunk;
      	});
      	netflocRes.on("error", function(err) {
      		console.log("neutron error:res", err);
      		res.status(500).send(err);
      	});
      	netflocRes.on("end", function() {
      		res.status(200).send(nodes);
      	});
	})
	getRequest.on("error", function(err) {
		console.log("netfloc error:req", err);
		res.send(err);
	});
	getRequest.end();
});

app.get("/api/netfloc-flows/:id", function(req, res) {
	console.log("/api/netfloc-flows");
	var id = req.params.id;
	var flows = "";
	var getRequest = http.request({
		host: config.netflocHost,
		port: config.netflocPort,
		auth: config.netflocAuth,
		method: "GET",
		path: "/restconf/operational/opendaylight-inventory:nodes/node/"+id+"/table/0",
		headers: {
			"contentType": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
			"Access-Control-Allow-Methods": "GET, PUT, POST"
      	}
	}, function(netflocRes) {
		netflocRes.on('data', function (chunk) {
			flows += chunk;
      	});
      	netflocRes.on("error", function(err) {
      		console.log("neutron error:res", err);
      		res.status(500).send(err);
      	});
      	netflocRes.on("end", function() {
      		res.status(200).send(flows);
      	});
	})
	getRequest.on("error", function(err) {
		console.log("netfloc error:req", err);
		res.send(err);
	});
	getRequest.end();
});


var startServer = function() {
	app.listen(config.guiPort, function() {
		console.log("listening on port " + config.guiPort);
	});
	getToken();
};

var saveConfig = function(config) {
	fs.writeFile('config.json', JSON.stringify(config, null, 4), function(err, res) {
		if (err) {
			console.log("save config error", err);
		}
	});
};

fs.readFile('config.json', function(err, file) {
	if (err) {
		// file generieren
		prompt.start();
		prompt.get(["guiPort",
			"netflocHost",
			"netflocPort",
			"netflocAuth",
			"keystoneHost",
			"keystonePort",
			"keystoneUser",
			"keystonePass",
			"keystoneTenant",
			"neutronHost",
			"neutronPort",
			"novaHost",
			"novaPort"], function(err, result) {
				config = result;
				saveConfig(config);
				startServer();
			});
		return;
	}
	config = JSON.parse(file);
	startServer();
});
