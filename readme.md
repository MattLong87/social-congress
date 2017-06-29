# Social Congress

<img src="http://i.imgur.com/pWp9qdn.png">

## Introduction
Social Congress provides a handy dashboard for checking out the Twitter feeds of your congresspeople. Using your browser's geolocation or a provided address, it accesses the Google Civic Information API and displays the Twitter timelines and buttons to easily send @-replies.

## How It Works
The user's information is stored in a state object, which is updated when the user chooses to use geolocation or enter their address manually. If they choose geolocation, their latitude and longitude is reverse-geocoded using the Google Maps API to determine their street address.

Next, the app sends the address to the Google Civic Information API, which returns a JSON object containing all the user's elected officials. The senators and representative are extracted and stored in the state object.

Finally, for each legislator in the state object, the DOM is updated with an embedded twitter timeline (the Twitter handles are helpfully provided by the Google API). A button is also added below each timeline to directly reply to that congressperson.

## Technologies Used
* jQuery
* AJAX
* HTML5
* CSS3
* Google APIs