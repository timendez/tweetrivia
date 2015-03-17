var username;
var isInverted = false;
var buttonSoundEffect = new Audio("sound/buttonSound.mp3");

function goback() {
   var timeoutID = setTimeout(function() {
      history.go(-1);
		clearTimeout(timeoutID);
	}, 150);
}

function populateLeaderboards() {
   isInverted = false;

   $("#actorCaption").html("Actor");
   $("#musicCaption").html("Music");
   $("#corporationCaption").html("Corporation");
   $("#nflCaption").html("NFL");
   $("#nbaCaption").html("NBA");
   $("#soccerCaption").html("Soccer");
   getTopScores("music");
   getTopScores("actor");
   getTopScores("corporation");
   getTopScores("NFL");
   getTopScores("nba");
   getTopScores("Soccer");
   
   var indexOfUser = document.URL.indexOf("?user=");
   var urlIndexPadding = 6;
   
   if(indexOfUser !== -1)
      username = document.URL.substring(indexOfUser + urlIndexPadding);
      
   if(username !== undefined || username !== "undefined")
      getHighScore(username, "following");
}

function invertScores() {
   if(isInverted) {
      $("#leaderboardButton2").html("View Inverted High Scores");
      populateLeaderboards();
   }
   else {
      $("#leaderboardButton2").html("View Regular High Scores");
      
      isInverted = true;

      $("#actorCaption").html("Inverted Actor");
      $("#musicCaption").html("Inverted Music");
      $("#corporationCaption").html("Inverted Corporation");
      $("#nflCaption").html("Inverted NFL");
      $("#nbaCaption").html("Inverted NBA");
      $("#soccerCaption").html("Inverted Soccer");
      getTopScores("musicInverted");
      getTopScores("actorInverted");
      getTopScores("corporationInverted");
      getTopScores("NFLInverted");
      getTopScores("nbaInverted");
      getTopScores("SoccerInverted");
      
      var indexOfUser = document.URL.indexOf("?user=");
      var urlIndexPadding = 6;
      
      if(indexOfUser !== -1)
         username = document.URL.substring(indexOfUser + urlIndexPadding);
         
      if(username !== undefined || username !== "undefined")
         getHighScore(username, "followingInverted");
   }
}

function receiveTopScores(results, dbCategory) {
   var tableResults = "";
   var category = dbCategory.replace("Inverted", "");
   
   $("#" + category + "TR").nextAll().remove();
   
   if(username === undefined) {
      for(var i = 0; i < results.length; i++) {
         tableResults += "<tr><td>" + results[i][0] + "</td><td>" + results[i][1] + "</td></tr>";
      }
   }
   else {
      for(var i = 0; i < results.length; i++) {
         if(results[i][0] === username) {
            tableResults += "<tr><td class=\"currentUser\">" + results[i][0] + "</td><td class=\"currentUser\">" + results[i][1] + "</td></tr>";
         }
         else {
            tableResults += "<tr><td>" + results[i][0] + "</td><td>" + results[i][1] + "</td></tr>";
         }
      }
   }

   $("#" + category + "TR").after(tableResults);
}

function receiveFollowingScores(result) {
   if(isInverted) {
      $("#followingScore").html(username + "'s " + " High Score for Inverted \"Following\":&nbsp&nbsp&nbsp" + result);
   }
   else {
      $("#followingScore").html(username + "'s " + " High Score for \"Following\":&nbsp&nbsp&nbsp" + result);
   }
}

function hideFollowingScore() {
   $("#followingScore").html("");
}

function playButtonSoundEffect() {
	buttonSoundEffect.play();
}
