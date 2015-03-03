function populateLeaderboards() {
   getTopScores("music");
   getTopScores("actor");
}

function receiveTopScores(results, category) {
   var tableResults = "";

   for(var i = 0; i < results.length; i++) {
      tableResults += "<tr><td>" + results[i][0] + "</td><td>" + results[i][1] + "</td></tr>"
   }

   $("#" + category + "TR").after(tableResults);
}