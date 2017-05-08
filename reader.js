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
	
	// ask for  user input to setup node with race, node and authentication identifiers
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
		if(! (cache.get("reading") == null || cache.get("reading").uid != uidToHex(mfrc522.getUid().data))){
			return;
		}
		
		// converts UID to hexadecimal and stores it in cache for 2 seconds
		cache.set("reading", { uid : uidToHex(mfrc522.getUid().data), time : new Date() }, 2);
		
		// builds PATCH-url by using cached variables set at start
		try {
		options.url = "https://bor-rest-masu1402.c9users.io/api/race/" + cache.get("prompt").rid;
		options.url += "/competitors/" + cache.get("reading").uid;
		options.url += "/readings/" + cache.get("prompt").nid; 
		options.body = cache.get("reading");
		} catch (error){
			console.error(error)
		}

		// send PATCH-request to REST API with Digest authentication
		request(options, function(error, response, body){
			if (error) console.error(error);
			console.log(options);
		});

	}, 50);
});

var options = {
	"url": "https://bor-rest-masu1402.c9users.io/api/",
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

/**
 * asks for user input which is used in HTTP-request
 */
function prompt(){
	
	try {
		read( { prompt: "Race identifier: " }, function (err, race) {
			read( { prompt: "Node #: " }, function (err, node) {
				read( { prompt: "Username: " }, function (err, username) {
					read( { prompt: "Password: ", silent: true }, function (err, password) {
						cache.set("prompt",
						{
							rid: race,
							nid: node
						})
						options.auth.user = username;
						options.auth.pass = password;
					})
				})
			})
		})
	} catch (err) {
		console.error(err);
	}
}

/**
 * converts first 4 bytes (uid) from read MIFARE tag and returns as hex-string
 */
function uidToHex(data){
	var hex = [];

	for(var i = 0; i < data.length - 1; i++){
		
		hex.push(data[i].toString(16));
	}
	
	return hex.join(":");
}
