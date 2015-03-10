var username;

function populateLeaderboards() {
   getTopScores("music");
   getTopScores("actor");
   getTopScores("corporation");
   
   var indexOfUser = document.URL.indexOf("?user=");
   var urlIndexPadding = 6;
   
   if(indexOfUser !== -1)
      username = document.URL.substring(indexOfUser + urlIndexPadding);
}

function receiveTopScores(results, category) {
   var tableResults = "";

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