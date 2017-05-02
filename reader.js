// set up =============================================== set up 
var express = require("express");
var app = express();
var request = require("request");
var mfrc522 = new (require("mfrc522-rpi"));
const cache = new(require("node-cache"));

// listen (start app with node reader.js) =============== listener 
app.listen(3000, function() {

	setInterval(function(){
	
		//console.log(cache.get("timing"));

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
				+ "/node/" + process.argv[2],
		options.body = cache.get("reading");


		// send PATCH-request to REST API with Digest authentication
		request(options, function(error, response, body){
			if (error) console.error(error);
			console.log(body);
		});
		
	}, 50);

});

var options = {
	"url": "https://bor-rest-masu1402.c9users.io/api/competitor",
	"method": "PATCH",
	"port": 8080,
	"auth": {
		"username": "masu1402",
		"password": "test",
		"sendImmediately": true
	},
	body: {},
	json: true
}
