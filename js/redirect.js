function redirectInit() {
   //from imgur
   var params = {}, queryString = location.search.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
   while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
   }
   alert(params['oauth_verifier']+" first");

   //Check if there is an access token 
   if(params['oauth_verifier']) {
      localStorage["verifier"] =  params['oauth_verifier'];
      alert("before callBack");
      window.opener.callBack();
      alert("no callBack");
  }
   window.close()
}


/*function redirectInit2() {
  var cb          = new Codebird;
  var current_url = location.toString();
  var query       = current_url.match(/\?(.+)$/).split("&amp;");
  var parameters  = {};
  var parameter;

  cb.setConsumerKey("STUFF", "HERE");

  for (var i = 0; i < query.length; i++) {
    parameter = query[i].split("=");
    if (parameter.length === 1) {
        parameter[1] = "";
    }
    parameters[decodeURIComponent(parameter[0])] = decodeURIComponent(parameter[1]);
  }

  // check if oauth_verifier is set
  if (typeof parameters.oauth_verifier !== "undefined") {
    // assign stored request token parameters to codebird here
    // ...
    cb.setToken(stored_somewhere.oauth_token, stored_somewhere.oauth_token_secret);

    cb.__call(
        "oauth_accessToken",
        {
            oauth_verifier: parameters.oauth_verifier
        },
        function (reply) {
            cb.setToken(reply.oauth_token, reply.oauth_token_secret);

            // if you need to persist the login after page reload,
            // consider storing the token in a cookie or HTML5 local storage
        }
    );
  }
}*/

window.onload = redirectInit;