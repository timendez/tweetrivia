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
var buttonSoundEffect;

$(document).ready(function() {
	cb = new Codebird();
	cb.setBearerToken(bearerToken);
	parseInit();
	
	buttonSoundEffect = new Audio("sound/buttonSound.mp3");
	
	$(document).bind('keydown', 'alt+ctrl+n', restart);
	
	$("#leaderboardButton").mousedown(function() {
		$("#leaderboardButton").removeClass("blackBorder");
		$("#leaderboardButton").addClass("whiteBorder");
	});
	
	$("#startButton").mousedown(function() {
		$("#startButton").removeClass("blackBorder");
		$("#startButton").addClass("whiteBorder");
	});
	
	$("#choice1").mousedown(function() {
		$("#choice1").removeClass("blackBorder");
		$("#choice1").addClass("whiteBorder");
	});
	
	$("#choice2").mousedown(function() {
		$("#choice2").removeClass("blackBorder");
		$("#choice2").addClass("whiteBorder");
	});
	
	$("#choice3").mousedown(function() {
		$("#choice3").removeClass("blackBorder");
		$("#choice3").addClass("whiteBorder");
	});
	
	$("#choice4").mousedown(function() {
		$("#choice4").removeClass("blackBorder");
		$("#choice4").addClass("whiteBorder");
	});
	
	$("#login").mousedown(function() {
		$("#login").animate({
			width: "162px",
			height: "32px",
			bottom: "2px",
			right: "2px"
		}, 100, "linear", function() {
			$("#login").animate({
				width: "158px",
				height: "28px",
				bottom: "0px",
				right: "0px"
			}, 100, "linear", function() {
				loginTwitter();
			});
		});
	});
	
	$("body").mouseup(function() {
		$("#leaderboardButton").removeClass("whiteBorder");
		$("#startButton").removeClass("whiteBorder");
		$("#choice1").removeClass("whiteBorder");
		$("#choice2").removeClass("whiteBorder");
		$("#choice3").removeClass("whiteBorder");
		$("#choice4").removeClass("whiteBorder");
		$("#login").removeClass("whiteBorder");
		$("#leaderboardButton").addClass("blackBorder");
		$("#startButton").addClass("blackBorder");
		$("#choice1").addClass("blackBorder");
		$("#choice2").addClass("blackBorder");
		$("#choice3").addClass("blackBorder");
		$("#choice4").addClass("blackBorder");
		$("#login").addClass("blackBorder");
	});
	
	// Only needed to do this once to obtain the bearer token. Now it's hard coded. 
    //applicationOnlyAuth();
});

function playButtonSoundEffect() {
	buttonSoundEffect.play();
}

function receiveChoices(receivedChoices) {
	choices = receivedChoices;
	
	// randomly select one to be the correct answer
	var random = getRandomInt(0,3);
	correct = choices[random];
	
	// get user pics to display on buttons with username
	var correctRealName;
	cb.__call(
		"users_lookup",
		"screen_name=" + choices[0] + "," + choices[1] + "," + choices[2] + "," + choices[3],
		function (reply, rate_limit_status) {
			if(reply !== undefined) {
				// display usernames and profile pics on choice buttons
				for(var i=0; i < reply.length; i++) {
					var elementSpecifier = "#choice" + i.toString();
					$(elementSpecifier).html(reply[i].name + "<br>" + choices[i]);
					$(elementSpecifier).html("<img src='" + reply[i].profile_image_url_https + "' alt='Error getting pic' class='profilepic'>");
					if(reply[i].screen_name === correct) {
						correctRealName = reply[i].name;
					}
				}
			}
			else {
				alert("Twitter API is not responding!");
			}
		},
		true
	);
	
	// get a tweet from the user we chose to be correct answer
	getTweet(correct, correctRealName);
	
	// the rest of the process is continued in the receiveTweet()
	// function called by the callback in getTweet
}

function animateHide() {
	$("#choice1").animate({
		right: '1000px',
	}, 500, "swing", function() {

	});
	
	$("#choice2").animate({
		left: '1000px',
	}, 500, "swing", function() {

	});
	
	$("#choice3").animate({
		right: '1000px',
	}, 500, "swing", function() {

	});
	
	$("#choice4").animate({
		left: '1000px',
	}, 500, "swing", function() {

	});
	
	$("#tweetText").html("");
	$("#tweet").animate({
		width: "0px"
	}, 500, "swing");
}

function animateShow(tweetText) {
	$("#choice1").animate({
		right: '0px',
	}, 500, "swing", function() {

	});
	
	$("#choice2").animate({
		left: '0px',
	}, 500, "swing", function() {
		
	});
	
	$("#choice3").animate({
		right: '0px',
	}, 500, "swing", function() {
		
	});
	
	$("#choice4").animate({
		left: '0px',
	}, 500, "swing", function() {
		
	});
	
	$("#tweet").animate({
		width: "400px"
	}, 500, "swing", function() {
		$("#tweetText").html(tweetText);
	});
}

function loadNewQuestion() {
	animateHide();
	clearInterval(timeI);
	clearInterval(checkI);
        timeI = checkI = false;
	
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

function receiveTweet(tweet, username, name) {
   var safeTweet = sanitizeTweet(tweet, username, name);

	animateShow(safeTweet);
	start();
}

function sanitizeTweet(tweet, username, name) {
	var cleanTweet = tweet;
	cleanTweet.replace(username, "{username hidden}");
	cleanTweet.replace(name, "{full name hidden}");
	var nameParts = name.split(" ");
	for(var i=0; i<nameParts.length; i++) {
		cleanTweet.replace(nameParts[i], "{partial name hidden}");
	}
	return cleanTweet;
}

function getTweet(username, name) {
	cb.__call(
		"statuses_userTimeline",
		"screen_name=" + username + "&count=100&exclude_replies=true&include_rts=false&trim_user=true",
		function (reply, rate_limit_status) {
			console.log(rate_limit_status);
			if(reply.length > 0) {
				var randomNumber = getRandomInt(0, reply.length);
				if(randomNumber === reply.length) {
					randomNumber = randomNumber - 1;
				}
				receiveTweet(reply[randomNumber].text, username, name);
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
      timeI = checkI = false;
      
      if(username !== undefined)
         checkHighscore(username, selectedCategory, score);
   }
}
function start(){
   $("#newHighscore").addClass("hide");
   $("#timer").attr("min", 0);
   $("#timer").attr("max", timePerQuestion);
   $("#timer").attr("value", timePerQuestion);
   $("#timeLeftLabel").html("Time Remaining: " + timePerQuestion + " seconds");
   $("#answerStatusText").html("&nbsp");
   gameInProgress = true;
   if(timeI == false || timeI == undefined)
   	timeI = window.setInterval(getTime, 1000);
   if(checkI == false || checkI == undefined)
   	checkI = window.setInterval(checkTime, 1000);
}
function change(){
   clearInterval(timeI);
   clearInterval(checkI);
   timeI = checkI = false;
   $("#timer").attr("value", timePerQuestion);
}
function restart(){
   $("#newHighscore").addClass("hide");
   $("#timer").attr("min", 0);
   $("#timer").attr("max", timePerQuestion);
   $("#timer").attr("value", timePerQuestion);
   $("#timeLeftLabel").html("Time Remaining: " + timePerQuestion + " seconds");
   $("#answerStatusText").html("&nbsp");
   $("#scoreVal").html("0");
   clearInterval(timeI);
   clearInterval(checkI);
   timeI = checkI = false;
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
      timeI = checkI = false;
      loadNewQuestion();
   }
   else {
      score = document.getElementById("scoreVal").innerHTML;
      displayWrong();
	  gameInProgress = false;
      clearInterval(timeI);
      clearInterval(checkI);
      timeI = checkI = false;
      
      if(username !== undefined)
         checkHighscore(username, selectedCategory, score);
   }
}

function updateHighscore(status, score) {
   if(status === "new" && score > 0) {
      $("#newHighscore").removeClass("hide");
   }
}

function openLeaderboard() {
	var timeoutID = setTimeout(function() {
		window.location.href = "leaderboard.html?user=" + username;
		clearTimeout(timeoutID);
	}, 150);

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