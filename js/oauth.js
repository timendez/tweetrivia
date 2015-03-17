var callBack;
function init(json){
   callBack = json.callback_function;
}
function loginTwitter() {
            var cb = new Codebird;
            cb.setConsumerKey("RBZqUOzXdgrxl6BP8wVbO9KAD", "kQDqhrljYgmVPA1G55KMyhRpT5DOO68GLDPLUUkvhX47TRUPOt");

                cb.__call(
                "oauth_requestToken",
                function (reply) {
                    // stores it
                    cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                    localStorage["token"] =  reply.oauth_token;
                    localStorage["tokenSecret"] =  reply.oauth_token_secret;

                    // gets the authorize screen URL
                    cb.__call(
                        "oauth_authorize",
                        {},
                        function (auth_url) {
                            window.open(auth_url, "Sign into Twitter");
                        }
                    );
            
                }
                );

        }

function callback(){
    var cb = new Codebird;
    cb.setConsumerKey("RBZqUOzXdgrxl6BP8wVbO9KAD", "kQDqhrljYgmVPA1G55KMyhRpT5DOO68GLDPLUUkvhX47TRUPOt");
    // assign stored request token parameters to codebird here
    // ...
    cb.setToken(localStorage["token"], localStorage["tokenSecret"]);

    cb.__call(
        "oauth_accessToken",
        {
            oauth_verifier: localStorage["verifier"]
        },
        function (reply) {
            cb.setToken(reply.oauth_token, reply.oauth_token_secret);
            username = reply.screen_name;
            setPic(username,"", cb);
            // if you need to persist the login after page reload,
            // consider storing the token in a cookie or HTML5 local storage
        }
    );
//-------------------------------

}

function setPic(screenName, URL, cb) {

    cb.__call(
    "users_show",
    "screen_name="+username,
    function (reply) {
        document.getElementById('username').innerHTML = "Yooo "+ screenName+"!!!!";
        document.getElementById("login").style.visibility = "hidden";
        $("#leaderboardLink").attr("href", "leaderboard.html?user=" + screenName);
        document.getElementById('profPic').src =  reply.profile_image_url_https;
            localStorage["screenName"] =  screenName;
            localStorage["profPicURL"] =  reply.profile_image_url_https;
            localStorage["cb"] =  cb;

    }
);

}

