var username;

function populateLeaderboards() {
   getTopScores("music");
   getTopScores("actor");
   getTopScores("corporation");
   
   try {
      username = document.URL.substring(document.URL.indexOf("?user=") + 6);
   }
   catch(err) {
      //user did not click on leaderboard link
   }
   
   if(username !== undefined)
      alert(username);
   else
      alert("weak");
}

function receiveTopScores(results, category) {
   var tableResults = "";

   for(var i = 0; i < results.length; i++) {
      tableResults += "<tr><td>" + results[i][0] + "</td><td>" + results[i][1] + "</td></tr>"
   }

   $("#" + category + "TR").after(tableResults);
}