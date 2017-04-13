// set up =============================================== set up 
var express = require("express");
var app = express();
var request = require("request");
var mfrc522 = new (require("mfrc522-rpi"));
const cache = new(require("node-cache"));

// listen (start app with node reader.js) =============== listener 
app.listen(3000, function() {

	setInterval(function(){
	
		console.log(cache.get("timing"));

		//skips loop if there is no card to be read
	        if(!mfrc522.findCard().status){
			return;
		}

		// skips loop if there is an error with UID scanner
       		if(!mfrc522.getUid().status){
			return;
		}

		// skips loop if unique identification is cached and the same as read card data
		if(! (cache.get("timing") == null || cache.get("timing").uid != mfrc522.getUid().data.join(""))){
			return;
		}
	
	        // store unique identifier in cache	
		cache.set("timing", { uid : mfrc522.getUid().data.join(""), time : new Date() }, 2);
		options.body = cache.get("timing");
		
		// send POST-request to REST API
		request(options, function(error, response){
			if (error) console.error(error);
		});
		
	}, 50);

});

var options = {
	url: "https://bor-rest-masu1402.c9users.io/",
	method: "post",
	port: 8080,
	body: {},
	json: true
}