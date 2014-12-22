(function() {
  var DofusAPI, FileCookieStore, api, fs, https, querystring, request;

  querystring = require('querystring');

  https = require('https');

  fs = require('fs');

  FileCookieStore = require('tough-cookie-filestore');

  request = require('request');

  request = request.defaults({
    jar: true
  });

  DofusAPI = (function() {
    function DofusAPI() {
      this.rootUrl = 'http://www.dofus.com/';
      this.logged = false;
      this.cookies = '';
      this.account = {
        pseudo: '',
        email: ''
      };
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
            _this.logged = true;
            return callback({
              success: true
            });
          } else {
            _this.logged = false;
            return callback({
              success: false
            });
          }
        };
      })(this));
    };

    DofusAPI.prototype.choosePseudo = function(pseudo) {
      if (this.logged) {
        return request('http://www.dofus.com/fr/choisir-votre-pseudo', {
          method: 'POST',
          headers: {
            "X-Requested-With": "XMLHttpRequest"
          },
          form: {
            'usernickname': pseudo
          }
        }, (function(_this) {
          return function(error, response, body) {};
        })(this));
      } else {
        return console.log('DofusAPI::ChoosePseudo -> You must be logged on a account before');
      }
    };

    DofusAPI.prototype.getAccountInformations = function() {
      var url;
      if (this.logged) {
        url = "https://account.ankama.com/fr/votre-compte/profil";
        return request.get(url, {}, (function(_this) {
          return function(error, response, body) {
            var matches, pattern;
            pattern = /<b>(.*?)<\/b>/ig;
            matches = body.match(pattern);
            _this.account.pseudo = matches[0].replace(/(<[^>]*>)/g, ' ').trim();
            _this.account.email = matches[1].replace(/(<[^>]*>)/g, ' ').trim();
            return console.log(_this.account);
          };
        })(this));
      } else {
        return console.log('DofusAPI::GetAccountInformations -> You must be logged on a account before');
      }
    };

    return DofusAPI;

  })();


  /*
  
    EXPERIMENTAL TEST
    TOUCH HERE JUST FOR TESTING
   */

  api = new DofusAPI();

  api.login("justarandomaccount", "justarandompassword", function(result) {
    if (result.success) {
      console.log('logged');
      return api.getAccountInformations(function(account) {});
    } else {
      return console.log('failed to login');
    }
  });

}).call(this);
