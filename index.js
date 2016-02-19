var _ = require("underscore"),
	util = require("util"),
	config = require("./config.json"),
	http = require("http"),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

var neutronPorts = [
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

app.post("/api/service-chain", function(req, res) {
	console.log("/api/service-chain", req.body);
	var postRequest = http.request({
		host: config.host,
		port: config.port,
		auth: config.auth,
		method: "POST",
		path: "/restconf/operations/netfloc:create-service-chain",
		headers: {
			'Content-Type': 'application/json',
			//'Content-Length': Buffer.byteLength(req.body)
      }
	}, function(netflocRes) {
		console.log("netfloc response");
		netflocRes.on('data', function (chunk) {
			console.log('Response: ' + chunk);
			res.status(200).send(chunk);
      	});
      	netflocRes.on("error", function(err) {
      		console.log("netfloc error:res", err);
      		res.status(500).send(err);
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

var token;

var getToken = function() {
	var postRequest = http.request({
		host: config.keystoneHost,
		port: config.keystonePort,
		//auth: config.auth,
		method: "POST",
		path: "/v2.0/ports",
		headers: {
			'Content-Type': 'application/json',
			//'Content-Length': Buffer.byteLength(req.body)
		}
	}, function(keyStoneRes) {
		console.log("keystone response");
		keyStoneRes.on('data', function (chunk) {
			console.log('Response: ' + chunk);
			token = chunk;
			console.log(token);
      	});
      	keyStoneRes.on("error", function(err) {
      		console.log("keystone error:res", err);
      	});
	})
	postRequest.on("error", function(err) {
		console.log("keystone error:req", err);
		res.send(err);
	});
	postRequest.write(JSON.stringify(keystone));
	postRequest.end();
};

getToken();

app.get("/api/neutron-ports", function(req, res) {
	console.log("/api/neutron-ports", req.body);
	var postRequest = http.request({
		host: config.neutronHost,
		port: config.neutronPort,
		//auth: config.auth,
		method: "POST",
		path: "/v2.0/ports",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Token ' + token
      }
	}, function(neutronRes) {
		console.log("neutron response");
		neutronRes.on('data', function (chunk) {
			console.log('Response: ' + chunk);
			res.send(chunk);
      	});
      	neutronRes.on("error", function(err) {
      		console.log("neutron error:res", err);
      	});
	})
	postRequest.on("error", function(err) {
		console.log("neutron error:req", err);
		res.send(err);
	});
	postRequest.write(JSON.stringify(req.body));
	postRequest.end();
});

app.listen(3000, function() {
	console.log("listening on port 3000");
});
