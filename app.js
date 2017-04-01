"use strict";
var API_KEY = "AIzaSyCEs-mEAnBuW5ORtH8UuhgUiVZKpMLZCFU";

//Single state object
var state = {
	locationAvailable: false,
	userLatitude: 0,
	userLongitude: 0,
	userAddress: "",
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
		$(".location-error").slideUp();
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
		},
		function(error){
			$(".location-error").slideDown();
		});
	}
	else{
		state.locationAvailable = false;
	}
};

//sets state.userAddress to string using reverse geocoding with given latitude and longitude
function getUserAddress(state){
	$(".results").html("Loading");
	var url = "https://maps.googleapis.com/maps/api/geocode/json?";
	var settings = {
		latlng: state.userLatitude + "," + state.userLongitude,
		key: API_KEY
		};
	$.getJSON(url, settings, function(data){
		state.userAddress = data.results[0].formatted_address;
		$(".js-address").val(state.userAddress);
		getLegislators(state, state.userAddress, displayLegislators);
	})
};

//populates state.legislators with an array of legislator objects
function getLegislators(state, address, callback){
	state.legislators = [];
	var url = "https://www.googleapis.com/civicinfo/v2/representatives/?roles=legislatorLowerBody&roles=legislatorUpperBody";
	var data = {
		address: address,
		key: API_KEY,
		levels: "country"
	}
	var settings = {
		dataType: "json",
		data: data,
		success: function(data){
				data.officials.map(function(official){
				state.legislators.push(official);
				})
				callback(state);
		},
		error: function(){
			$(".results").html("");
			$(".results-error").slideDown()}
	};
	$.ajax(url, settings);
};
	
// populates .results section with name, party, timeline, and tweet button
function displayLegislators(state){
	$(".results").html("");
	$(".results-error").slideUp();

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
		var party = legislator.party == "Democratic" ? "DEMOCRAT" : legislator.party.toUpperCase();
		var chamber = legislator.urls[0].includes("senate") ? "Senator" : "Representative";
		var tweetButton = "<a href='https://twitter.com/intent/tweet?text=@" + twitterHandle + "'><button class = 'tweet-button'><i class='fa fa-share' aria-hidden='true'></i> Tweet @"+ twitterHandle +"</button></a>"
		$(".results").append(
			"<div class = 'twitter-embed'><span class = 'party " + legislator.party + "'>" + party + "</span><span class = 'chamber'>" + chamber + "</span><span class = 'name'>" + legislator.name + "</span>" + html1 + twitterHandle + html2 + twitterHandle + html3 + tweetButton + "</div>"
			);
	});
};

//Sample JSON URL: https://www.googleapis.com/civicinfo/v2/representatives/?key=AIzaSyCEs-mEAnBuW5ORtH8UuhgUiVZKpMLZCFU&address=27605&roles=legislatorLowerBody&roles=legislatorUpperBody