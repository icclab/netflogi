var _ = require("underscore"),
	util = require("util"),
	config = require("./config.json"),
	http = require("http"),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

app.post("/api/create-service-chain", function(req, res) {
	console.log("/api/createServiceChain", req.body);
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
			res.send(chunk);
      	});
      	netflocRes.on("error", function(err) {
      		console.log("netfloc error:res", err);
      	});
	})
	postRequest.on("error", function(err) {
		console.log("netfloc error:req", err);
		res.send(err);
	});
	postRequest.write(JSON.stringify(req.body));
	postRequest.end();
});

app.listen(80, function() {
	console.log("listening on port 80");
});
