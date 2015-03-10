var callBack;

function init(json){
   callBack = json.callback_function;
}
function loginTwitter() {
            var cb = new Codebird;
            cb.setConsumerKey("2jCvFchz3pa5CrVxTITm3DbJ0", "3wZizuZjWjwpGnACuxwJbyQNdL8KUTW2zwY8g9rQDyApW9ahGE");

            $("#login").click(function(){
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
            });
        }

function callback(){
    var cb = new Codebird;
    cb.setConsumerKey("2jCvFchz3pa5CrVxTITm3DbJ0", "3wZizuZjWjwpGnACuxwJbyQNdL8KUTW2zwY8g9rQDyApW9ahGE");
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
            document.getElementById('username').innerHTML = "Yooo "+ reply.screen_name+"!!!!";
            username = reply.screen_name;
            setUser(reply.screen_name);
            // if you need to persist the login after page reload,
            // consider storing the token in a cookie or HTML5 local storage
        }
    );
//-------------------------------

}

