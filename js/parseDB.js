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
   query.limit(numToGet);

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
   
   if(user !== undefined && user !== null && !isNaN(parseInt(currentScore))) {
      query.first({
         success: function(object) {
            var dbHighscore;
            
            if(object === undefined) {
               //First score entered
               saveHighscore(user, category, currentScore);
               updateHighscore("new", currentScore);
            }
            else {
               //Already existing score
               dbHighscore = object.get("highscore");
               
               if(dbHighscore >= currentScore) {
                  updateHighscore("old", dbHighscore)
               }
               else {
                  deleteHighscore(user, category);
                  saveHighscore(user, category, currentScore);
                  updateHighscore("new", currentScore);
               }
            }
         },
         error: function(object) {
            return false;
         }
      });
   }
}


//Removes a previous highscore, given the user and the category
function deleteHighscore(user, category) {
   var query = new Parse.Query("Highscore");
   
   query.equalTo("user", user);
   query.equalTo("category", category);

   query.first({
      success: function(object) {
         object.destroy({});
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
         if(object !== undefined)
            receiveFollowingScores(object.get("highscore"));
         else
            hideFollowingScore();
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


   highscoreObject.save({"user": user, "category": category, "highscore": parseInt(highscore)}, {
      success: function(object) {
         return true; //saved correctly to DB
      },
      error: function(error) {
         alert("Error: Could not save to database");
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
   if(category == "following") {
      if(localStorage["screenName"]) {
         var bearerToken = "AAAAAAAAAAAAAAAAAAAAAAiReAAAAAAA8T0Ktx%2FCejokTd41KVNXg%2F4BVpY%3DpwcnM59v7rDOyZ1U2i7gvB1hg8IQxov4icPjwgxvCd99u7TCZR";
         cb = new Codebird();
         cb.setBearerToken(bearerToken);
         cb.setConsumerKey("2jCvFchz3pa5CrVxTITm3DbJ0", "3wZizuZjWjwpGnACuxwJbyQNdL8KUTW2zwY8g9rQDyApW9ahGE");
         cb.__call(
            "friends_list",
            "screen_name="+localStorage["screenName"],
            function (reply) {
                for(var i = 0; i < reply.users.length; i++) {
                  handles[i] = reply.users[i].screen_name;
               }
               receiveChoices(getRandomHandles(handles, 4));
            }
         );
      }
      else {
         alert("You must sign in to play this category!")
      }

   }
   else {
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

            receiveChoices(getRandomHandles(handles, 4));
         },
         error: function (error) {
            return false; //DB down
         }
      });
   }
}


//Grabs and returns 4 random handles from all handles given
function getRandomHandles(allHandles, num) {
   var fourHandles = [];
   var usedIndexes = [];
   var count = 0;

   while(count < num) {
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