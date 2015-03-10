function parseInit() {
   Parse.initialize("nAqwkduLZrl2V4x93yMbdoKvQmdkg1S9uQc5248N", "ImgGDYIe27jCXp91kAMvtkqylFHDKYzhVLIiC4BQ");
}

//Given a category, builds an array of
//{user, highscore} objects, in descending order.
//Used to populate the leaderboards
function getTopScores(category) {
   var numToGet = 10;
   var query = new Parse.Query("Highscore");
   var results = [];
   
   query.equalTo("category", category);
   query.addDescending("highscore");
   query.count(numToGet);

   query.find({
      success: function(objectArr) {
         for(var i = 0; i < objectArr.length; i++) {
            results.push([objectArr[i].get("user"), objectArr[i].get("highscore")]);
         }

         //FRONTEND CALL - populates the leaderboard
         receiveTopScores(results, category);
      },
      error: function(object) {
         return false;
      }
   });
}


//Given a user, category, and current score, checks if new high score
//Returns the highest score, and whether it is a previous high score, or a new one
// {"status": "old",
//  "score": highscore}
// OR
// {"status": "new",
//  "score": highscore}
function checkHighscore(user, category, currentScore) {
   var query = new Parse.Query("Highscore");
   
   query.equalTo("user", user);
   query.equalTo("category", category);
   
   query.first({
      success: function(object) {
         var dbHighscore;
         
         if(object === undefined) {
            alert("saving highscore");
            saveHighscore(user, category, currentScore);
            updateHighscore("new", currentScore);
         }
         else {
            dbHighscore = object.get("highscore");
            saveHighscore(user, category, dbHighscore);
            dbHighscore >= currentScore ? updateHighscore("old", dbHighscore) : updateHighscore("new", currentScore);
         }
      },
      error: function(object) {
         return false;
      }
   });
}


//Returns the high score value of user in a specific category
//Should be used to build the leaderboard
function getHighScore(user, category) {
   var query = new Parse.Query("Highscore");
   
   query.equalTo("user", user);
   query.equalTo("category", category);
   
   query.first({
      success: function(object) {
         //TODO Call function elsewhere rather than return
         //return object.get("highscore");
      },
      error: function(object) {
         return false;
      }
   });
}


//Saves the user, category, and highscore in the database
function saveHighscore(user, category, highscore) {
   var HighscoreObject = Parse.Object.extend("Highscore");
   var highscoreObject = new HighscoreObject();

   highscoreObject.save({"user": user, "category": category, "highscore": highscore}, {
      success: function(object) {
      alert("successful save");
         return true; //saved correctly to DB
      },
      error: function(error) {
      alert("error code: " + JSON.parse(error));
         return false; //didn't save correctly to DB
      }
   });
}


//Used for saving a Twitter user's account name, along with category, in the database
//saveAccount("kanye", "music");
function saveAccount(account, category) {
   var AccountObject = Parse.Object.extend("Account");
   var accountObject = new AccountObject();  
   
   
   accountObject.save({"handle": account, "category": category}, {
      success: function(object) {
         return true; //saved correctly to DB
      },
      error: function(error) {
         return false; //didn't save correctly to DB
      }
   });
}


//Returns four random celebrity Twitter accounts given a category
//Returns false if unsuccessful
function getChoices(category) {
   var query = new Parse.Query("Account");
   var handles = [];

   //Setting query to get all accounts within categories
   query.equalTo("category", category);
   
   query.find({
      success: function(object) { //Successfully retrieved data

         //Object = undefined signifies category does not exist
         if(object === undefined) {
            return false;
         }

         for(var i = 0; i < object.length; i++) {
            handles[i] = object[i].get("handle");
         }

         receiveChoices(getFour(handles));
      },
      error: function (error) {
         return false; //DB down
      }
   });
}


//Grabs and returns 4 random handles from all handles given
function getFour(allHandles) {
   var fourHandles = [];
   var usedIndexes = [];
   var count = 0;

   while(count < 4) {
	   var randomIndex = getRandomInt(0, allHandles.length - 1);
	   if($.inArray(randomIndex, usedIndexes) == -1) {
		   usedIndexes.push(randomIndex);
		   fourHandles[count] = allHandles[randomIndex];
		   count++;
	   }
   }

   return fourHandles;
}


//Generates a random integer between min and max
function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}