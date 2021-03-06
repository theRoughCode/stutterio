window.fbAsyncInit = function() {
  FB.init({
    appId      : '186402965239019',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.10'
  });

  FB.AppEvents.logPageView();
};

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    FB.api('/me', function(response1) {
      const userInfo = JSON.stringify({
        id: response1.id,
        name: response1.name
      });
      document.cookie = `user=${userInfo};  path=/` 
      console.log(response1.id);

      window.location = "/text";
    });

  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


function logout() {
  //check if logout is
  FB.getLoginStatus(function(ret) {
      /// are they currently logged into Facebook?
      if(ret.authResponse) {
          //they were authed so do the logout
          FB.logout(function(response) {
             console.log(response);
             window.location = '/';
          });
      }
  });
}
