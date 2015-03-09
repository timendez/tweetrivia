function redirectInit() {
   //from imgur
   var params = {}, queryString = location.search.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
   while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
   }

   //Check if there is an access token 
   if(params['oauth_verifier']) {
      localStorage["verifier"] =  params['oauth_verifier'];
      window.opener.callBack();
  }
   window.close()
}



window.onload = redirectInit;