// set up =============================================== set up 
var express = require("express");
var app = express();
var read = require("read");
var request = require("request");
var mfrc522 = new (require("mfrc522-rpi"));
const cache = new(require("node-cache"));
var readline = require('readline');

// listen (start app with node reader.js) =============== listener 
app.listen(3000, function() {
	prompt();
		
	setInterval(function(){

		// skips loop if there is no card to be read
	        if(!mfrc522.findCard().status){
			return;
		}

		// skips loop if there is an error with UID scanner
       		if(!mfrc522.getUid().status){
			return;
		}

		// skips loop if unique identification is cached and the same as read card data
		if(! (cache.get("reading") == null || cache.get("reading").uid != mfrc522.getUid().data.join(""))){
			return;
		}
	
	        // store unique identifier in cache	
		cache.set("reading", { uid : mfrc522.getUid().data.join(""), time : new Date() }, 2);
		options.url = "https://bor-rest-masu1402.c9users.io/api/competitor/" + cache.get("reading").uid 
				+ "/node/" + nid,
		options.body = cache.get("reading");


		// send PATCH-request to REST API with Digest authentication
		request(options, function(error, response, body){
			if (error) console.error(error);
			console.log(options);
		});

	}, 50);
});

var nid = "";
var options = {
	"url": "https://bor-rest-masu1402.c9users.io/api",
	"method": "PATCH",
	"port": 8080,
	"auth": {
		"user": "",
		"pass": "",
		"sendImmediately": false
	},
	body: {},
	json: true
}


function prompt(){
	
	try {
		read( { prompt: "Node #: " }, function (err, node) {
			read( { prompt: "Username: " }, function (err, username) {
				read( { prompt: "Password: ", silent: true }, function (err, password) {
					nid = node;
					options.auth.user = username;
					options.auth.pass = password;
				})
			})
		})
	} catch (err) {
		console.error(err);
	}
}
		
