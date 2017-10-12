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

	// create user objects, retrieve logo link, retrieve online streaming info, output to web page
	createUser();
	getLogo(userArr);
	getStatus(userArr);
	setTimeout(printStatus, 1000);

	// instantiate a User object to store username, streaming status, etc.
	// and add obj to the array of user objects
	function createUser() {
			$.each(users, function(index, username) {
				userArr.push(new User(username));
			});
	}

	// add twitch user profile logos
	function getLogo(userArr) {
		$.each(userArr, function(index) {

			// api for twitch.tv users
			var url = 'https://wind-bow.glitch.me/twitch-api/users/';
			url += userArr[index].username + '?callback=?';
			console.log('getLogo url:', url);

			$.ajax({
		        url: url,
		        async: true,
		        dataType: 'json',
		        success: function(json) {
					if (typeof json === 'object' && json.logo) {
						console.log('matched json logo', json.logo);
						userArr[index].logo = json.logo;
					} else {
						console.log('error: connection success but logo not found in json file');	
						userArr[index].logo = 'http://via.placeholder.com/300x300?text=?';
					}
		        }
		    }).fail(function(){
		    	console.log("failed retrieving data for ", userArr[index].username);
		    });
		});
	 }

	// get user's streaming status
	function getStatus(userArr) {
		$.each(userArr, function(index) {

			// api url for twitch.tv streams
			var url = 'https://wind-bow.glitch.me/twitch-api/streams/';
			url += userArr[index].username + '?callback=?';
			console.log(url);

			// check status of twitch.tv user to see if they are currently streaming
			$.ajax({
		        url: url,
		        async: true,
		        dataType: 'json',
		        success: function(json) {
					if (typeof json === 'object' && json.stream === null) {
						userArr[index].status = 'offline';
					} else if (typeof json === 'object' && json.stream.stream_type === 'live') {
						userArr[index].status = 'online';
						userArr[index].game = json.stream.game + ': ' + json.stream.channel.status;
					} else {
						console.log('error');	
					}
		        }
		    }).fail(function(){
		    	console.log("failed retrieving data for ", userArr[index].username);
		    });
		});
	}

	// output twitch streamer information to web page
	function printStatus() {
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