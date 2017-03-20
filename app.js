"use strict";

//Single state object
var state = {
	locationAvailable: false,
	userLatitude: 0,
	userLongitude: 0,
	twitterHandles: []
};



//Event listener for "Use my location" button click
$(".js-use-my-location").click(function(e){
	e.preventDefault();
	getUserLocation(state, function(){
		displayState(state);
	});
});

//Event listener for enter key on address form
$(".js-address").keydown(function(e){
	if (e.keyCode == 13){
		getTwitterHandles(state, $(this).val());
	}
});



//State modification functions
function getUserLocation(state, callback){
	if ("geolocation" in navigator){
		state.locationAvailable = true;
		navigator.geolocation.getCurrentPosition(function(position){
			state.userLatitude = position.coords.latitude;
			state.userLongitude = position.coords.longitude;
			callback(state);
		});
	}
	else{
		state.locationAvailable = false;
	}
};

function getTwitterHandles(state, address){
	state.twitterHandles = [];
	var url = "https://www.googleapis.com/civicinfo/v2/representatives/?roles=legislatorLowerBody&roles=legislatorUpperBody";
	var API_KEY = "AIzaSyCEs-mEAnBuW5ORtH8UuhgUiVZKpMLZCFU";
	var settings = {
		key: API_KEY,
		address: address,
		levels: "country",
		};
	$.getJSON(url, settings, function(data){
		data.officials.map(function(official){
			official.channels.filter(function(channel){
				if (channel.type == "Twitter"){
					state.twitterHandles.push(channel.id);
				}
			})
		})
		displayTimelines(state);
	})
};


function displayTimelines(state){
	$(".results").html("");
	var html1 = '<a class="twitter-timeline" href="https://twitter.com/';
	var html2 = '" data-width = "360" data-height = "600">Tweets by ';
	var html3 = '</a> <script async src="http://platform.twitter.com/widgets.js" charset="utf-8"></script>';
	state.twitterHandles.map(function(handle){
		$(".results").append("<div class = 'twitter-embed'>" + html1 + handle + html2 + handle + html3 + "</div>");
	})
}





function displayState(state){
	console.log(state);
}


//Sample JSON URL: https://www.googleapis.com/civicinfo/v2/representatives/?key=AIzaSyCEs-mEAnBuW5ORtH8UuhgUiVZKpMLZCFU&address=27605&roles=legislatorLowerBody&roles=legislatorUpperBody