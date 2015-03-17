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
var correctFullName;
var waitTimeoutId;
var selectedGameMode;
var correctAnswerFound;
var numChoicesFilled;
var correctButton;
var invertedQuestionBoxContent;

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
   

   if(localStorage["screenName"]  !== undefined)
      username = localStorage["screenName"];
	
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
	correctFullName = "CORRECT_FULL_NAME_NOT_SET"; // this needs to always be before the call to getTweet()
	invertedQuestionBoxContent = "CONTENT_NOT_SET"; // this needs to always be before the call to getMultipleTweets()
	// get user pics to display on buttons with username
	cb.__call(
		"users_lookup",
		"screen_name=" + choices[0] + "," + choices[1] + "," + choices[2] + "," + choices[3],
		function (reply, rate_limit_status) {
			if(reply !== undefined) {
				if(selectedGameMode === "normal") {
					// display usernames and profile pics on choice buttons
					for(var i=0; i < reply.length; i++) {
						//console.log("choice " + i.toString());
						var elementSpecifier = "#choice" + (i + 1).toString();
						$(elementSpecifier).html(reply[i].name + "<br>" + choices[i]);
						$(elementSpecifier).prepend("<img src='" + reply[i].profile_image_url_https + "' alt='Error getting pic' class='profilepic'>");
						//console.log("screen_name=" + reply[i].screen_name.toString() + "   correct=" + correct);
						if(reply[i].screen_name.toLowerCase() === correct.toLowerCase()) {
							correctFullName = reply[i].name.toString();
						}
					}
				}
				else if(selectedGameMode === "inverted") {
					for(var j=0; j < reply.length; j++) {
						if(reply[j].screen_name.toLowerCase() === correct.toLowerCase()) {
							invertedQuestionBoxContent = "<img src='" + reply[j].profile_image_url_https + "' alt='Error getting pic' class='questionProfilePic'>" + "<br>" + reply[j].name + "<br>" + correct;
						}
					}
				}
				else {
					alert("Error: selectedGameMode not set! This should not happen!");
					return;
				}
			}
			else {
				alert("Twitter API is not responding!");
				return;
			}
		},
		true);
	
	// get a tweet from the user we chose to be correct answer
	if(selectedGameMode === "normal") {
		getTweet(correct);
	}
	else if(selectedGameMode === "inverted") {
		numChoicesFilled = 0;
		correctAnswerFound = false;
		$("#choice1").html("Choice A");
		$("#choice2").html("Choice B");
		$("#choice3").html("Choice C");
		$("#choice4").html("Choice D");
		getMultipleTweets();
	}
	else {
		alert("Error: selectedGameMode not set! This should not happen!");
	}
	
	// the rest of the process is continued in the receiveTweet()
	// function called by the callback in getTweet
}

function animateHide() {
	$("#choice1").animate({
		right: '1000px'
	}, 500, "swing", function() {

	});
	
	$("#choice2").animate({
		left: '1000px'
	}, 500, "swing", function() {

	});
	
	$("#choice3").animate({
		right: '1000px'
	}, 500, "swing", function() {

	});
	
	$("#choice4").animate({
		left: '1000px'
	}, 500, "swing", function() {

	});
	
	$("#tweetText").html("");
	$("#tweet").animate({
		width: "0px"
	}, 500, "swing");
}

function animateShow(tweetText) {
	$("#choice1").animate({
		right: '0px'
	}, 500, "swing", function() {

	});
	
	$("#choice2").animate({
		left: '0px'
	}, 500, "swing", function() {
		
	});
	
	$("#choice3").animate({
		right: '0px'
	}, 500, "swing", function() {
		
	});
	
	$("#choice4").animate({
		left: '0px'
	}, 500, "swing", function() {
		
	});
	
	$("#tweet").animate({
		width: "400px"
	}, 500, "swing", function() {
		$("#tweetText").html(tweetText);
	});
}

function loadNewQuestion(retry) {
	animateHide();
	clearInterval(timeI);
	clearInterval(checkI);
	clearInterval(waitTimeoutId);
        timeI = checkI = false;
	
	// get category user selected
	selectedCategory = $("#categorySelect option:selected").val();
	
	// get game mode selected
	selectedGameMode = $("#gameModeSelect option:selected").val();
	if(retry === undefined) {
		if(selectedGameMode == "normal") {
			for(var i=1; i<=4; i++) {
				$("#choice" + i.toString()).removeClass("choiceButtonInverted");
				$("#choice" + i.toString()).addClass("choiceButtonNormal");
			}
		}
		else if(selectedGameMode == "inverted") {
			for(var i=1; i<=4; i++) {
				$("#choice" + i.toString()).removeClass("choiceButtonNormal");
				$("#choice" + i.toString()).addClass("choiceButtonInverted");
			}
		}
		else {
			alert("selectedGameMode not set. This should not happen!");
		}
	}

	// get mode user selected
	selectedMode = $("#modeSelect option:selected").val();

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
	// Wait until correctFullName has been set
	waitTimeoutId = setInterval(function() {
		if(correctFullName !== "CORRECT_FULL_NAME_NOT_SET") {
			clearTimeout(waitTimeoutId);
			var safeTweet = sanitizeTweet(tweet, correct, correctFullName);
			animateShow(safeTweet);
			start();
		}
		else {
			console.log("waiting..." + correctFullName);
		}
	}, 100);
}

function sanitizeTweet(tweet, username, fullname) {
	var cleanTweet = tweet;
	var usernameRegExp = new RegExp(username, "ig");
	cleanTweet = cleanTweet.replace(usernameRegExp, "{username}");
	var fullnameRegExp = new RegExp(fullname, "ig");
	cleanTweet = cleanTweet.replace(fullnameRegExp, "{full name}");
	cleanTweet = cleanTweet.replace(/💀/g, '<emoji>'); //removes unknown characters
	cleanTweet = cleanTweet.replace(/https?:\/\/t.co\/[^\s]*/g, '{link}');
	var nameParts = fullname.split(" ");
	for(var i=0; i<nameParts.length; i++) {
		if(nameParts[i] === " " || nameParts[i] === "") {
			nameParts.splice(i,1);
		}
	}
	//console.log("nameParts=" + nameParts.toString());
	for(i=0; i<nameParts.length; i++) {
		var replacementText = "{partial name}";
		if(nameParts.length == 2) {
			if(i===0){
				replacementText = "{first name}";
			}
			else if(i==1) {
				replacementText = "{last name}";
			}
		}
		var partialnameRegExp = new RegExp(nameParts[i], "ig");
		cleanTweet = cleanTweet.replace(partialnameRegExp, replacementText);
	}
	return cleanTweet;
}

function getTweet(username) {
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
				receiveTweet(reply[randomNumber].text);
			}
			else {
				console.log("Failed to retrieve any tweets. Trying again.");
				loadNewQuestion();
			}
		},
		true);
}

function getMultipleTweets(single) {
	var query;
	if(single !== undefined && single === true) {
		query = "q=from:" + correct;
	}
	else {
		query = "q=from:" + choices[0] + "+OR+from:" + choices[1] + "+OR+from:" + choices[2] + "+OR+from:" + choices[3] + "&count=100&result_type=recent";
	}
	cb.__call(
		"search_tweets",
		query,
		function (reply, rate_limit_status) {
			for(var i=0; i < reply.statuses.length && numChoicesFilled < 4; i++) {
				//console.log("correctAnswerFound=" + correctAnswerFound.toString() + "\nreply[i].user.screen_name.toLowerCase()=" + reply[i].user.screen_name.toLowerCase() + "\ncorrect.toLowerCase()=" + correct.toLowerCase());
				if(correctAnswerFound === false && reply.statuses[i].user.screen_name.toLowerCase() === correct.toLowerCase()) {
					correctButton = "choice" + (numChoicesFilled + 1).toString();
					correctAnswerFound = true;
					$("#choice" + (numChoicesFilled + 1).toString()).html(sanitizeTweet(reply.statuses[i].text, reply.statuses[i].user.screen_name, reply.statuses[i].user.name));
					numChoicesFilled++;
				}
				else if(reply.statuses[i].user.screen_name.toLowerCase() !== correct.toLowerCase() && (correctAnswerFound === true || numChoicesFilled < 3)) {
					$("#choice" + (numChoicesFilled + 1).toString()).html(sanitizeTweet(reply.statuses[i].text, reply.statuses[i].user.screen_name, reply.statuses[i].user.name));
					numChoicesFilled++;
				}
			}
			if(numChoicesFilled < 4) {
				//get another batch of 100 and keep trying to fill choices
				if(single !== undefined && single === true) {
					loadNewQuestion(true); // already tried searching again, with no results. Try another user
					return;
				}
				if(correctAnswerFound) {
					getMultipleTweets();
					return;
				}
				else {
					getMultipleTweets(true);
					return;
				}
			}
			// Wait until correctFullName has been set
			waitTimeoutId = setInterval(function() {
				if(invertedQuestionBoxContent !== "CONTENT_NOT_SET") {
					clearTimeout(waitTimeoutId);
					animateShow(invertedQuestionBoxContent);
					start();
				}
				else {
					//console.log("waiting..." + invertedQuestionBoxContent);
				}
			}, 100);
		},
		true);
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
		clearInterval(waitTimeoutId);
		timeI = checkI = false;

		if(username !== undefined) {
         if(selectedGameMode === "normal") {
            checkHighscore(username, selectedCategory, score);
         }
         else {
            checkHighscore(username, selectedCategory + "Inverted", score);
         }
		}
	}
}
function start(){
	clearInterval(waitTimeoutId);
   $("#newHighscore").addClass("hide");
   $("#timer").attr("min", 0);
   $("#timer").attr("max", timePerQuestion);
   $("#timer").attr("value", timePerQuestion);
   $("#timeLeftLabel").html("Time Remaining: " + timePerQuestion + " seconds");
   $("#answerStatusText").html("&nbsp");
   gameInProgress = true;
   if(timeI === false || timeI === undefined) {
   	  timeI = window.setInterval(getTime, 1000);
	}
   if(checkI === false || checkI === undefined) {
   	  checkI = window.setInterval(checkTime, 1000);
    }
}
function change(){
   clearInterval(timeI);
   clearInterval(checkI);
   clearInterval(waitTimeoutId);
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
   clearInterval(waitTimeoutId);
   timeI = checkI = false;
   $("#middle").removeClass("hide");
   loadNewQuestion();
}

function answer(str) {
	if(gameInProgress === false) {
		return;
	}
	var answerCheck = false;
	if(selectedGameMode === "normal") {
		value = document.getElementById(str).innerHTML;
		res = value.split(">");
		ans = res[res.length - 1];
		ans = ans.replace(" ", "");
		answerCheck = (ans.localeCompare(correct) === 0);
   }
   else if(selectedGameMode === "inverted") {
		answerCheck = (str === correctButton);
   }
   else {
		alert("selectedGameMode not set. This should not happen!");
   }

   if (answerCheck) {
      score = document.getElementById("scoreVal").innerHTML;
      score++;
      document.getElementById("scoreVal").innerHTML = score;
      displayCorrect();
      clearInterval(timeI);
      clearInterval(checkI);
      clearInterval(waitTimeoutId);
      timeI = checkI = false;
      loadNewQuestion();
   }
   else {
      score = document.getElementById("scoreVal").innerHTML;
      displayWrong();
      gameInProgress = false;
      clearInterval(timeI);
      clearInterval(checkI);
      clearInterval(waitTimeoutId);
      timeI = checkI = false;
      
      if(username !== undefined) {
         if(selectedGameMode === "normal") {
            checkHighscore(username, selectedCategory, score);
         }
         else {
            checkHighscore(username, selectedCategory + "Inverted", score);
         }
	  }
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
	if(selectedGameMode === "normal") {
		statusText.html("Game over. The correct answer was: " + correct);
	}
	else if(selectedGameMode === "inverted") {
		var gameoverText = "Game over. The correct answer was ";
		if(correctButton === "choice1") {
			gameoverText += "upper left.";
		}
		if(correctButton === "choice2") {
			gameoverText += "upper right.";
		}
		if(correctButton === "choice3") {
			gameoverText += "bottom left.";
		}
		if(correctButton === "choice4") {
			gameoverText += "bottom right.";
		}
		statusText.html(gameoverText);
	}
	else {
		alert("selectedGameMode not set. This should not happen!");
	}
}

function displayTimeUp() {
	var statusText = $("#answerStatusText");
	statusText.removeClass("green");
	statusText.addClass("red");
	if(selectedGameMode === "normal") {
		statusText.html("Time's up! The correct answer was: " + correct);
	}
	else if(selectedGameMode === "inverted") {
		var gameoverText = "Time's up! The correct answer was ";
		if(correctButton === "choice1") {
			gameoverText += "upper left.";
		}
		if(correctButton === "choice2") {
			gameoverText += "upper right.";
		}
		if(correctButton === "choice3") {
			gameoverText += "bottom left.";
		}
		if(correctButton === "choice4") {
			gameoverText += "bottom right.";
		}
		statusText.html(gameoverText);
	}
	else {
		alert("selectedGameMode not set. This should not happen!");
	}
}

function logout() {
   localStorage.removeItem("screenName");
   location.reload();
}