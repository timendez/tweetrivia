var timeI, checkI;
var timePerQuestion = 60;
var cb;
var bearerToken = "AAAAAAAAAAAAAAAAAAAAAAiReAAAAAAA8T0Ktx%2FCejokTd41KVNXg%2F4BVpY%3DpwcnM59v7rDOyZ1U2i7gvB1hg8IQxov4icPjwgxvCd99u7TCZR";
var choices;

$(document).ready(function() {
	cb = new Codebird;
	cb.setBearerToken(bearerToken);
	parseInit();
    //applicationOnlyAuth();
});

function receiveChoices(receivedChoices) {
	choices = receivedChoices;
	
	// randomly select one to be the correct answer
	var random = getRandomInt(0,3);
	var correct = choices[random];
	
	//alert("choices[0]=" + choices[0] + "\nchoices[1]=" + choices[1] + "\nchoices[2]=" + choices[2] + "\nchoices[3]=" + choices[3]);

	// display choices on buttons
	$("#choice1").html(choices[0]);
	$("#choice2").html(choices[1]);
	$("#choice3").html(choices[2]);
	$("#choice4").html(choices[3]);
	
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
	cb.setConsumerKey("2jCvFchz3pa5CrVxTITm3DbJ0", "3wZizuZjWjwpGnACuxwJbyQNdL8KUTW2zwY8g9rQDyApW9ahGE");
	cb.__call(
		"oauth2_token",
		{},
		function (reply) {
			if(reply.token_type === "bearer") {
				bearerToken = reply.access_token;
				alert("bearerToken=" + bearerToken);
			}
		}
	);
}

function receiveTweet(tweet) {
	$("#tweetText").html(tweet);
}

function getTweet(user) {
	cb.__call(
		"search_tweets",
		"q=" + user + "&count=25",
		function (reply, rate_limit_status) {
			console.log(rate_limit_status);
			if(reply.statuses !== undefined) {
				receiveTweet(reply.statuses[getRandomInt(0,24)].text);
			}
			else {
				alert("Twitter API is not responding!");
			}
		},
		true
	);
}

function getTime(){
   var x = document.getElementById("timer");
   var time = x.innerHTML
   var y = parseInt(time) - 1;
   if(y <=0){
      y = 0;
   }
   x.innerHTML = y.toString();
}

function checkTime(){
   var x = document.getElementById("timer").innerHTML;
   x = parseInt(x)
   if(x <= 0){
      $("#mask").removeClass("hide");
      $("#popup").removeClass("hide");
      clearInterval(timeI);
      clearInterval(checkI);
   }
}
function start(){
   $("#mask2").addClass("hide");
   $("#popup2").addClass("hide");
   document.getElementById("timer").innerHTML = timePerQuestion;
   timeI = window.setInterval(getTime, 1000);
   checkI = window.setInterval(checkTime, 1000);
   loadNewQuestion();
}
function change(){
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
   $("#mask2").removeClass("hide");
   $("#popup2").removeClass("hide");
}
function restart(){
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
   document.getElementById("timer").innerHTML = 5;
   timeI = window.setInterval(getTime, 1000);
   checkI = window.setInterval(checkTime, 1000);
}

function answer(str){
}