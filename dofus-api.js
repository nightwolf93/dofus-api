(function() {
  var DofusAPI, api, fs, https, querystring, request;

  querystring = require('querystring');

  https = require('https');

  fs = require('fs');

  request = require('request');

  DofusAPI = (function() {
    function DofusAPI() {
      this.rootUrl = 'http://www.dofus.com/';
      this.logged = false;
    }

    DofusAPI.prototype.login = function(username, password, callback) {
      var loginFailedUrl, url;
      url = "https://account.ankama.com/sso";
      loginFailedUrl = "http://www.dofus.com/fr#loginfailed=failed";
      return request.post(url, {
        form: {
          'action': 'login',
          'from': 'http://www.dofus.com/fr',
          'login': username,
          'password': password,
          'remember': 1
        }
      }, (function(_this) {
        return function(error, response, body) {
          if (response.headers.location !== loginFailedUrl) {
            return callback({
              success: true
            });
          } else {
            return callback({
              success: false
            });
          }
        };
      })(this));
    };

    return DofusAPI;

  })();

  window.DofusAPI = DofusAPI;

  api = new DofusAPI();

  api.login("justarandomaccount", "justarandompassword", function(result) {
    if (result.success) {
      return console.log('logged');
    } else {
      return console.log('failed to login');
    }
  });

}).call(this);
