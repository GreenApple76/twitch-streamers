$(document).ready(function() {

	// user object to store twitch streamer information
	var User = function(username) {
		this.username = username;
		this.logo = null;
		this.link = null;
		this.status = null;
		this.game = null;
	};

	// setup empty array to store user objects
	var userArr = [];

	// twitch.tv streamer usernames
	var users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

	// create array of 'channels' urls to be used for api requests
	var channelsURLs = getURLs('channels', users);

	// generate array of URLs for api requests
	function getURLs (itemType, users) {
		return users.map(user => 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/' + itemType + '/' + user);
	}

	// create user objects, 
	createUser();
	
	// api requests to retrieve logo link, retrieve online streaming info, output to web page
	// array of ajax promises credit: https://stackoverflow.com/a/24706694
	$.when.apply($, channelsURLs.map(function(url) { return $.ajax(url); }))
		.done(function() {
			var results = [];
			// push all ajax result data onto an array
			for (var i = 0; i < arguments.length; i++) {
				results.push(arguments[i][0]);
			}

			// cycle through json objects from ajax requests above
			var index = 0;
			for (json of results) {
					// assign logo to user
					if (typeof json === 'object' && json.logo) {
						console.log('matched json logo', json.logo);
						userArr[index].logo = json.logo;
					} else {
						console.log('error: connection success but logo not found in json file');	
						userArr[index].logo = 'http://via.placeholder.com/300x300?text=?';
					}

					// assign status and game to user
					if (typeof json === 'object' && json.status === null) {
						userArr[index].status = 'offline';
					} else if (typeof json === 'object' && json.status !== null) {
						userArr[index].status = 'online';
						userArr[index].game = json.game + ': ' + json.status;
					} else {
						console.log('error');	
					}
				index++;
			}

			// output user object data to web page
			$.each(userArr, function(index) {

				var classesToAdd = 'profile clearfix ' + userArr[index].status;
				if (userArr[index].status === "offline") {
					classesToAdd += " hide";
					$('.results').append('<div class="' + classesToAdd + '">' 
						+ '<img src="' + userArr[index].logo + '"><p>' + userArr[index].username + ' is ' + userArr[index].status + '</p></div>');
				} else {
					$('.results').append('<div class="profile clearfix ' + userArr[index].status + '">' + '<a href="https://twitch.tv/'
						+ userArr[index].username + '"><img src="' + userArr[index].logo + '"><p>' + userArr[index].username + ' is '
						+ userArr[index].status  + '. ' + userArr[index].game + '</a></p></div>');
				}
			});
		});

	// instantiate a User object to store username, streaming status, etc.
	// and add obj to the array of user objects
	function createUser() {
			$.each(users, function(index, username) {
				userArr.push(new User(username));
			});
	}

	// event handler: remove active class from all <li> then add active class to clicked <li>
	$('ul li').click(function(){
	   $('ul li').removeClass('active'); 
	   $(this).addClass('active'); 
	});

	// event handler: only show online users when user clicks online link
	$('#online').on('mousedown', function() {
		showAll();
		hideOffline();
	});

	// event handler: only show offline users when user clicks offline link
	$('#offline').on('mousedown', function() {
		showAll();
		hideOnline();
	});

	// event handler: show both online and offline users when user clicks all link
	$('#all').on('mousedown', function() {
		showAll();
	});

	function hideOffline() {
		$('.offline').each(function() {
			$(this).addClass('hide');
		});
	}

	function hideOnline() {
		$('.online').each(function() {
			$(this).addClass('hide');
		});
	}

	function showAll() {
		$('.profile').each(function() {
			$(this).removeClass('hide');
		});
	}

});