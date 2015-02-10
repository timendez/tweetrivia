function parseInit() {
   Parse.initialize("nAqwkduLZrl2V4x93yMbdoKvQmdkg1S9uQc5248N", "ImgGDYIe27jCXp91kAMvtkqylFHDKYzhVLIiC4BQ");
   
   //testing
   test("@kanye", "music");
   //saveAccount("@twentyOnePilots", "music");
}


function test(account, category) {
   var CategoryObject = Parse.Object.extend("Category");
   var categoryObject = new CategoryObject();
   var arr = [];
   var query = new Parse.Query("Category");
   var music = "HELLO";
   arr.push(account);
   
   categoryObject.save({music: arr}, {
      success: function(object) {
         //return true; //saved correctly to DB
            alert("step 1 done");
      },
      error: function(error) {
         //return false; //didn't save correctly to DB
      }
   });
   
   query.include(category);
   
   query.first({
      success: function(object) {
         alert(object.toSource());
      },
      error: function(object) {
         alert("K");
      }
   });
}

//Used for saving a Twitter user's account name, along with category, in the database
function saveAccount(account, category) {
   var CategoryObject = Parse.Object.extend("Category");
   var categoryObject = new CategoryObject();
   var arr = [];
   var query = new Parse.Query("Category");
   
   //Setting query to get all accounts within categories
   query.include(category);
   
   query.first({
      success: function(object) { //Successfully retrieved data
      
         //Object = undefined signifies category does not exist
         if(object !== undefined) {
            arr = object;
         }

         arr.push(account);
         
         categoryObject.save({category: arr}, {
            success: function(object) {
               return true; //saved correctly to DB
            },
            error: function(error) {
               return false; //didn't save correctly to DB
            }
         });
      },
      error: function (error) {
         return false; //DB down
      }
   });
}