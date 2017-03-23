"use strict";
var API_KEY = "AIzaSyCEs-mEAnBuW5ORtH8UuhgUiVZKpMLZCFU";

//Single state object
var state = {
	locationAvailable: false,
	userLatitude: 0,
	userLongitude: 0,
	userAddress: "",
	twitterHandles: [],
	legislators: []
};


//Event listener for "Use my location" button click
$(".js-use-my-location").click(function(e){
	e.preventDefault();
	getUserLocation(state, getUserAddress);
});

//Event listener for enter key on address form
$(".js-address").keydown(function(e){
	if (e.keyCode == 13){
		getLegislators(state, $(this).val(), displayLegislators);
	}
});


//State modification functions
//sets state.userLatitude and state.userLongitude, then passes state to given callback function
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

//sets state.userAddress to string using reverse geocoding with given latitude and longitude
function getUserAddress(state){
	var url = "https://maps.googleapis.com/maps/api/geocode/json?";
	var settings = {
		latlng: state.userLatitude + "," + state.userLongitude,
		key: API_KEY
		};
	$.getJSON(url, settings, function(data){
		state.userAddress = data.results[0].formatted_address;
		getLegislators(state, state.userAddress, displayLegislators);
	})
};

//sets state.twitterHandles to an array of legislators' twitter handles
// function getTwitterHandles(state, address, callback){
// 	state.twitterHandles = [];
// 	var url = "https://www.googleapis.com/civicinfo/v2/representatives/?roles=legislatorLowerBody&roles=legislatorUpperBody";
// 	var settings = {
// 		key: API_KEY,
// 		address: address,
// 		levels: "country",
// 		};
// 	$.getJSON(url, settings, function(data){
// 		data.officials.map(function(official){
// 			official.channels.filter(function(channel){
// 				if (channel.type == "Twitter"){
// 					state.twitterHandles.push(channel.id);
// 				}
// 			})
// 		})
// 		callback(state);
// 	});
// };

//populates state.legislators with an array of legislator objects
function getLegislators(state, address, callback){
	state.legislators = [];
	var url = "https://www.googleapis.com/civicinfo/v2/representatives/?roles=legislatorLowerBody&roles=legislatorUpperBody";
	var settings = {
		key: API_KEY,
		address: address,
		levels: "country",
	};
	$.getJSON(url, settings, function(data){
		data.officials.map(function(official){
			state.legislators.push(official);
		})
	callback(state);
	});
};
	

//populates .results section with twitter timelines
// function displayTimelines(state){
// 	$(".results").html("");
// 	var html1 = '<a class="twitter-timeline" href="https://twitter.com/';
// 	var html2 = '" data-width = "360" data-height = "600">Tweets by ';
// 	var html3 = '</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
// 	state.twitterHandles.map(function(handle){
// 		$(".results").append("<div class = 'twitter-embed'>" + html1 + handle + html2 + handle + html3 + "</div>");
// 	})
// }

// populates .results section with name, party, and timeline
function displayLegislators(state){
	$(".results").html("");
	var html1 = '<a class="twitter-timeline" href="https://twitter.com/';
	var html2 = '" data-width = "360" data-height = "600">Tweets by ';
	var html3 = '</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';

	state.legislators.map(function(legislator){
		var twitterHandle = "";
		legislator.channels.filter(function(channel){
			if (channel.type == "Twitter"){
				twitterHandle = channel.id;
			}
		});
		$(".results").append(
			"<div class = 'twitter-embed'><span class = 'party " + legislator.party + "'>" + legislator.party.toUpperCase() + "</span><span class = 'name'>" + legislator.name + "</span>" + html1 + twitterHandle + html2 + twitterHandle + html3 + "</div>"
			);
	});
};

//Sample JSON URL: https://www.googleapis.com/civicinfo/v2/representatives/?key=AIzaSyCEs-mEAnBuW5ORtH8UuhgUiVZKpMLZCFU&address=27605&roles=legislatorLowerBody&roles=legislatorUpperBody