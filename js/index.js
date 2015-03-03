var timeI, checkI;
var timePerQuestion = 20;
var cb;
var bearerToken = "AAAAAAAAAAAAAAAAAAAAAAiReAAAAAAA8T0Ktx%2FCejokTd41KVNXg%2F4BVpY%3DpwcnM59v7rDOyZ1U2i7gvB1hg8IQxov4icPjwgxvCd99u7TCZR";
var choices;
var userIDg = null;

$(document).ready(function() {
	cb = new Codebird();
	cb.setBearerToken(bearerToken);
	parseInit();
    //applicationOnlyAuth();
});

var correct = null;
function receiveChoices(receivedChoices) {
	choices = receivedChoices;
	
	// randomly select one to be the correct answer
	var random = getRandomInt(0,3);
	correct = choices[random];
	
	// get user pics to display on buttons with username
	cb.__call(
		"users_lookup",
		"screen_name=" + choices[0] + "," + choices[1] + "," + choices[2] + "," + choices[3],
		function (reply, rate_limit_status) {
			if(reply !== undefined) {
				// display usernames
				$("#choice1").html(choices[0]);
				$("#choice2").html(choices[1]);
				$("#choice3").html(choices[2]);
				$("#choice4").html(choices[3]);
			
				// display profile pic
				$("#choice1").prepend("<img src='" + reply[0].profile_image_url_https + "' alt='Couldn't retrieve profile pic' class='profilepic'>");
				$("#choice2").prepend("<img src='" + reply[1].profile_image_url_https + "' alt='Couldn't retrieve profile pic' class='profilepic'>");
				$("#choice3").prepend("<img src='" + reply[2].profile_image_url_https + "' alt='Couldn't retrieve profile pic' class='profilepic'>");
				$("#choice4").prepend("<img src='" + reply[3].profile_image_url_https + "' alt='Couldn't retrieve profile pic' class='profilepic'>");
			}
			else {
				alert("Twitter API is not responding!");
			}
		},
		true
	);
	
	// get a tweet from the user we chose to be correct answer
	getTweet(correct);
	
	// the rest of the process is continued in the receiveTweet()
	// function called by the callback in getTweet
}

function loadNewQuestion() {
	// get category user selected
	var selectedCategory = $("#category option:selected").val();

	// get 4 Twitter account names from the selected category
	getChoices(selectedCategory);
	
	// the rest of the process continues when receiveChoices() is
	// called from the callback inside getChoices
}

// following https://dev.twitter.com/oauth/application-only
function applicationOnlyAuth() {
            cb.setConsumerKey("RBZqUOzXdgrxl6BP8wVbO9KAD", "kQDqhrljYgmVPA1G55KMyhRpT5DOO68GLDPLUUkvhX47TRUPOt");
	cb.__call(
		"oauth2_token",
		{},
		function (reply) {
			if(reply.token_type === "bearer") {
				bearerToken = reply.access_token;
				cb.setBearerToken(reply.access_token);
				//alert("bearerToken=" + bearerToken);
			}
		}
	);
}

function receiveTweet(tweet) {
	$("#tweetText").html(tweet);
	start();
}

function getTweet(user) {
	cb.__call(
		"search_tweets",
		"q=from%3A" + user + "&count=25",
		function (reply, rate_limit_status) {
			console.log(rate_limit_status);
			if(reply.statuses !== undefined) {
				if(reply.statuses.length == 0) {
					loadNewQuestion();
				}
				receiveTweet(reply.statuses[getRandomInt(0,reply.statuses.length)].text);
			}
			else {
				alert("Twitter API is not responding!");
			}
		},
		true
	);
}

function getTime() {
   var time = $("#timer").attr("value");
   var y = time - 1;
   if(y <=0){
      y = 0;
   }
   $("#timer").attr("value", y);
   $("#timeLeftLabel").html("Time Remaining: " + y + " seconds");
}

function checkTime(){
   var x = $("#timer").attr("value");
   if (x <= 0) {
      document.getElementById("text").innerHTML = "Time's Up!"
      document.getElementById("finalScore").innerHTML = ""
      $("#mask").removeClass("hide");
      $("#popup").removeClass("hide");
      clearInterval(timeI);
      clearInterval(checkI);
   }
}
function start(){
   $("#mask").addClass("hide");
   $("#popup2").addClass("hide");
   $("#timer").attr("min", 0);
   $("#timer").attr("max", timePerQuestion);
   $("#timer").attr("value", timePerQuestion);
   $("#timeLeftLabel").html("Time Remaining: " + timePerQuestion + " seconds");
   timeI = window.setInterval(getTime, 1000);
   checkI = window.setInterval(checkTime, 1000);
}
function change(){
   $("#popup").addClass("hide");
   $("#popup2").removeClass("hide");
   clearInterval(timeI);
   clearInterval(checkI);
   $("#timer").attr("value", timePerQuestion);
}
function restart(){
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
   $("#popup2").addClass("hide");
   $("#timer").attr("value", timePerQuestion);
   loadNewQuestion();
}

function answer(str) {
    value = document.getElementById(str).innerHTML;
    res = value.split(">");
    ans = res[res.length - 1];
    ans = ans.replace(" ", "");
    if (ans.localeCompare(correct) == 0) {
        score = document.getElementById("scoreVal").innerHTML;
        score++;
        document.getElementById("scoreVal").innerHTML = score;
        $("#timer").attr("value", timePerQuestion);
        clearInterval(timeI);
        clearInterval(checkI);
        loadNewQuestion();
    }
    else {
        score = document.getElementById("scoreVal").innerHTML;
        document.getElementById("text").innerHTML = "Wrong Answer!"
        document.getElementById("finalScore").innerHTML = "Score: " + score;
        $("#timer").attr("value", timePerQuestion);
        document.getElementById("scoreVal").innerHTML = 0;
        clearInterval(timeI);
        clearInterval(checkI);
        $("#mask").removeClass("hide");
        $("#popup").removeClass("hide");
    }


function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      userIDg = response.id;
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '895378573826197',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function Logout(){
    FB.logout(function () { document.location.reload(); });
  }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {

    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      str = 'Hi ' + response.name + '!'; 
      str += "<input type='button' value='Logout' onclick='Logout();'/>";
      document.getElementById('status').innerHTML = str;
      document.getElementById("profile").src = "https://graph.facebook.com/"+response.id+"/picture?type=large";
     userIDg = response.id;
    });
  }
}