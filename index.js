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

//mocked data for neutronPorts
var neutronPorts = [
	{ id: "1", mac_address: "fa:16:3e:47:47:00", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.2"},]},
	{ id: "2", mac_address: "fa:16:3e:a0:25:f2", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.4"}]},
	{ id: "3", mac_address: "fa:16:3e:5d:02:57", fixed_ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.3"}]},
	{ id: "4", mac_address: "fa:16:3e:bb:a4:ca", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.1"}]},
	{ id: "5", mac_address: "fa:16:3e:62:b4:f2", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.7"}]},
	{ id: "6", mac_address: "fa:16:3e:bb:1f:e0", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.4"}]},
	{ id: "7", mac_address: "fa:16:3e:3d:36:b6", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.3"}]},
	{ id: "8", mac_address: "fa:16:3e:79:75:3f", fixed_ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.2"}]},
];

var neutronPortId = 8;

//mocked data for SCs
var serviceChains = [
	{ id: "1", vnf_list: "test",},
	{ id: "2", vnf_list: "test",},
	{ id: "3", vnf_list: "test",},
	{ id: "4", vnf_list: "test",},
	{ id: "5", vnf_list: "test",},
	{ id: "6", vnf_list: "test",},
	{ id: "7", vnf_list: "test",},
	{ id: "8", vnf_list: "test",}
];

var serviceChainId = 8;

//mocked data for VNFs
var virNetFuns = [
	{ id: "1", ingress_port: "ingress_port1", egress_port: "egress_port1", name: "test1", description: "description1"},
	{ id: "2", ingress_port: "ingress_port2", egress_port: "egress_port2", name: "test2", description: "description2"},
	{ id: "3", ingress_port: "ingress_port3", egress_port: "egress_port3", name: "test3", description: "description3"},
	{ id: "4", ingress_port: "ingress_port4", egress_port: "egress_port4", name: "test4", description: "description4"},
	{ id: "5", ingress_port: "ingress_port5", egress_port: "egress_port5", name: "test5", description: "description5"},
	{ id: "6", ingress_port: "ingress_port6", egress_port: "egress_port6", name: "test6", description: "description6"},
	{ id: "7", ingress_port: "ingress_port7", egress_port: "egress_port7", name: "test7", description: "description7"},
	{ id: "8", ingress_port: "ingress_port8", egress_port: "egress_port8", name: "test8", description: "description8"}
];

var virNetFunId = 8;

//routing funktionen
app.get("/api/service-chain", function(req, res){
	console.log("GET /api/service-chain/");
	res.status(200).send({ serviceChains: serviceChains });
});

//new post function for the service chain
app.post("/api/service-chain", function(req, res){
	console.log("POST /api/service-chain/", req.body);
	virNetFunId = virNetFunId + 1;
	serviceChains.push({ id: serviceChainId.toString(), vnf_list: req.body.input['vir-net-funs'], });

	res.status(200).send({ virNetFuns: virNetFuns });
});

//new post function for the virtual network function
app.post("/api/vir-net-fun", function(req, res){
	console.log("POST /api/vir-net-fun/", req.body);
	virNetFunId = virNetFunId + 1;
	virNetFuns.push({ id: virNetFunId.toString(), ingress_port: req.body.input['ingress_port'],
	 egress_port: req.body.input['egress_port'], name: req.body.input['name'], description: req.body.input['description'], });
	res.status(200).send({ virNetFuns: virNetFuns });
});

//new get function for receiving the vnfs
app.get("/api/vir-net-fun", function(req, res){
	console.log("GET /api/vir-net-fun/");
	res.status(200).send({ virNetFuns: virNetFuns });
});

//new get function for receiving the sfcs
app.get("/api/service-chain/:id", function(req, res) {
	console.log("GET /api/service-chain/" + req.params.id);
	res.status(200).send(_.find(serviceChains, function(serviceChain) {
		return req.params.id === serviceChain.id;
	}));
});

app.get("/api/vir-net-fun/:id", function(req, res) {
	console.log("GET /api/vir-net-fun/" + req.params.id);

	res.status(200).send(_.find(virNetFuns, function(virNetFun) {
		return req.params.id === virNetFun.id;
	}));
});

// new delete function for the sfc
app.delete("/api/service-chain/:id", function(req, res) {
	console.log("DELETE /api/service-chain/" + req.params.id);
	serviceChains = _.filter(serviceChains, function(serviceChain) {
		return serviceChain.id !== req.params.id;
	});
	res.status(200).send();
});

//new delete function for the vnf
app.delete("/api/vir-net-fun/:id", function(req, res) {
	console.log("DELETE /api/vir-net-fun/" + req.params.id);
	virNetFuns = _.filter(virNetFuns, function(virNetFun) {
		return virNetFun.id !== req.params.id;
	});
	res.status(200).send();
});

app.get("/api/neutron-ports", function(req, res) {
	console.log("/api/neutron-ports");
	res.status(200).send({ ports: neutronPorts });
});

app.get("/api/vir-net-funs", function(req, res) {
	console.log("/api/vir-net-funs");
	res.status(200).send({ ports: virNetFuns });
});

fs.readFile('config.json', function(err, file) {
	config = JSON.parse(file);
	app.listen(config.guiPort, function() {
		console.log("listening on port " + config.guiPort);
	});
});
