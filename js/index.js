var timeI, checkI;
var timePerQuestion = 20;
var cb; //codebird object
var bearerToken = "AAAAAAAAAAAAAAAAAAAAAAiReAAAAAAA8T0Ktx%2FCejokTd41KVNXg%2F4BVpY%3DpwcnM59v7rDOyZ1U2i7gvB1hg8IQxov4icPjwgxvCd99u7TCZR";
var choices;
var userIDg = null;
var username;
var selectedCategory;
var correctResponses = ["Correct!", "Nice!", "You got it!", "Right on!", "Yeah baby!"];
var correct = null;
var gameInProgress = false;

$(document).ready(function() {
	cb = new Codebird();
	cb.setBearerToken(bearerToken);
	parseInit();
	
	$("#leaderboardButton").mousedown(function() {
		$("#leaderboardButton").removeClass("blackBorder");
		$("#leaderboardButton").addClass("whiteBorder");
	}).mouseup(function() {
		$("#leaderboardButton").removeClass("whiteBorder");
		$("#leaderboardButton").addClass("blackBorder");
	});
	
	$("#startButton").mousedown(function() {
		$("#startButton").removeClass("blackBorder");
		$("#startButton").addClass("whiteBorder");
	}).mouseup(function() {
		$("#startButton").removeClass("whiteBorder");
		$("#startButton").addClass("blackBorder");
	});
	
	$("#choice1").mousedown(function() {
		$("#choice1").removeClass("blackBorder");
		$("#choice1").addClass("whiteBorder");
	}).mouseup(function() {
		$("#choice1").removeClass("whiteBorder");
		$("#choice1").addClass("blackBorder");
	});
	
	$("#choice2").mousedown(function() {
		$("#choice2").removeClass("blackBorder");
		$("#choice2").addClass("whiteBorder");
	}).mouseup(function() {
		$("#choice2").removeClass("whiteBorder");
		$("#choice2").addClass("blackBorder");
	});
	
	$("#choice3").mousedown(function() {
		$("#choice3").removeClass("blackBorder");
		$("#choice3").addClass("whiteBorder");
	}).mouseup(function() {
		$("#choice3").removeClass("whiteBorder");
		$("#choice3").addClass("blackBorder");
	});
	
	$("#choice4").mousedown(function() {
		$("#choice4").removeClass("blackBorder");
		$("#choice4").addClass("whiteBorder");
	}).mouseup(function() {
		$("#choice4").removeClass("whiteBorder");
		$("#choice4").addClass("blackBorder");
	});
	
	// Only needed to do this once to obtain the bearer token. Now it's hard coded. 
    //applicationOnlyAuth();
});

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
	if(username === undefined) {
		alert("Please login to Twitter before playing. Thanks!");
		return;
	}
	clearInterval(timeI);
	clearInterval(checkI);
	
	// get category user selected
	selectedCategory = $("#categorySelect option:selected").val();

	// get 4 Twitter account names from the selected category
	getChoices(selectedCategory);
	
	// the rest of the process continues when receiveChoices() is
	// called from the callback inside getChoices
}

// following https://dev.twitter.com/oauth/application-only
function applicationOnlyAuth() {
	cb.setConsumerKey("2jCvFchz3pa5CrVxTITm3DbJ0", "3wZizuZjWjwpGnACuxwJbyQNdL8KUTW2zwY8g9rQDyApW9ahGE");
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
		"statuses_userTimeline",
		"screen_name=" + user + "&count=100&exclude_replies=true&include_rts=false&trim_user=true",
		function (reply, rate_limit_status) {
			console.log(rate_limit_status);
			if(reply.length > 0) {
				receiveTweet(reply[getRandomInt(0,reply.length)].text);
			}
			else {
				console.log("Failed to retrieve any tweets. Trying again.");
				loadNewQuestion();
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
	  displayTimeUp();
	  gameInProgress = false;
      clearInterval(timeI);
      clearInterval(checkI);
      checkHighscore(username, selectedCategory, score);
   }
}
function start(){
   $("#timer").attr("min", 0);
   $("#timer").attr("max", timePerQuestion);
   $("#timer").attr("value", timePerQuestion);
   $("#timeLeftLabel").html("Time Remaining: " + timePerQuestion + " seconds");
   $("#answerStatusText").html("&nbsp");
   gameInProgress = true;
   timeI = window.setInterval(getTime, 1000);
   checkI = window.setInterval(checkTime, 1000);
}
function change(){
   clearInterval(timeI);
   clearInterval(checkI);
   $("#timer").attr("value", timePerQuestion);
}
function restart(){
   $("#timer").attr("min", 0);
   $("#timer").attr("max", timePerQuestion);
   $("#timer").attr("value", timePerQuestion);
   $("#timeLeftLabel").html("Time Remaining: " + timePerQuestion + " seconds");
   $("#answerStatusText").html("&nbsp");
   $("#scoreVal").html("0");
   clearInterval(timeI);
   clearInterval(checkI);
   loadNewQuestion();
}

function answer(str) {
	if(gameInProgress == false) {
		return;
	}
   value = document.getElementById(str).innerHTML;
   res = value.split(">");
   ans = res[res.length - 1];
   ans = ans.replace(" ", "");

   if (ans.localeCompare(correct) == 0) {
      score = document.getElementById("scoreVal").innerHTML;
      score++;
      document.getElementById("scoreVal").innerHTML = score;
	  displayCorrect();
      clearInterval(timeI);
      clearInterval(checkI);
      loadNewQuestion();
   }
   else {
      score = document.getElementById("scoreVal").innerHTML;
      displayWrong();
	  gameInProgress = false;
      clearInterval(timeI);
      clearInterval(checkI);
      checkHighscore(username, selectedCategory, score);
   }
}

function updateHighscore(status, score) {
   if(status === "new" && score > 0) {
      alert("New high score for " + username + "! " + score);
   }
}

function openLeaderboard() {
	window.location.href = "leaderboard.html";
}

function displayCorrect() {
	var statusText = $("#answerStatusText");
	statusText.removeClass("red");
	statusText.addClass("green");
	statusText.html(correctResponses[getRandomInt(0,correctResponses.length)]);
}

function displayWrong() {
	var statusText = $("#answerStatusText");
	statusText.removeClass("green");
	statusText.addClass("red");
	statusText.html("Game over. The correct answer was: " + correct);
}

function displayTimeUp() {
	var statusText = $("#answerStatusText");
	statusText.removeClass("green");
	statusText.addClass("red");
	statusText.html("Time's up! The correct answer was: " + correct);
}