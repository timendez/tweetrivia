var user;

function setUser(name) {
   alert("here!");
   user = name;
}

function populateLeaderboards() {
   getTopScores("music");
   getTopScores("actor");
   getTopScores("corporation");
   
   if(user !== undefined)
      alert(user);
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