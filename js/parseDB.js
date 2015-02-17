function parseInit() {
   Parse.initialize("nAqwkduLZrl2V4x93yMbdoKvQmdkg1S9uQc5248N", "ImgGDYIe27jCXp91kAMvtkqylFHDKYzhVLIiC4BQ");
}


//Used for saving a Twitter user's account name, along with category, in the database
//saveAccount("@kanye", "music");
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


function getChoices(category) {
   var query = new Parse.Query("Account");
   var handles;
   
   //Setting query to get all accounts within categories
   query.equalTo("category", category);
   
   query.find({
      success: function(object) { //Successfully retrieved data
      
         //Object = undefined signifies category does not exist
         if(object === undefined) {
            return false;
         }

         for(var i = 0; i < object.length; i++) {
            handles.push(object[i].get("handle"));
         }
         
         return handles;
      },
      error: function (error) {
         return false; //DB down
      }
   });
}