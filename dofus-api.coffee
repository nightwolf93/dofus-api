querystring = require('querystring')
https = require('https')
fs = require('fs')
FileCookieStore = require('tough-cookie-filestore')
request = require('request');
#require('request-debug')(request)
request = request.defaults({ jar : true })


class DofusAPI
  constructor: ->
    @rootUrl = 'http://www.dofus.com/'
    @logged = false
    @cookies = '';
    @account = { pseudo: '', email: '' }

  login: (username, password, callback) ->
    url = "https://account.ankama.com/sso"
    loginFailedUrl = "http://www.dofus.com/fr#loginfailed=failed"
    request.post url, {
      form: {
        'action' : 'login'
        'from' : 'http://www.dofus.com/fr'
        'login' : username
        'password' : password
        'remember' : 1
      }
    }, (error, response, body) =>
      if response.headers.location != loginFailedUrl
        @logged = true
        callback { success: true }
      else
        @logged = false
        callback { success: false }

  choosePseudo: (pseudo) ->
    if @logged
      request 'http://www.dofus.com/fr/choisir-votre-pseudo'
        , {
        method: 'POST'
        headers: { "X-Requested-With" : "XMLHttpRequest" }
        form: {
          'usernickname' : pseudo
        }
      }, (error, response, body) =>
    else
      console.log 'DofusAPI::ChoosePseudo -> You must be logged on a account before'

  getAccountInformations: ->
    if @logged
      url = "https://account.ankama.com/fr/votre-compte/profil"
      request.get url, {}, (error, response, body) =>
        pattern = /<b>(.*?)<\/b>/ig
        matches = body.match pattern

        @account.pseudo = matches[0].replace(/(<[^>]*>)/g,' ').trim();
        @account.email = matches[1].replace(/(<[^>]*>)/g,' ').trim();
        console.log @account
    else
      console.log 'DofusAPI::GetAccountInformations -> You must be logged on a account before'

###

  EXPERIMENTAL TEST
  TOUCH HERE JUST FOR TESTING

###

api = new DofusAPI()
api.login "justarandomaccount", "justarandompassword", (result) ->
  if result.success
    console.log 'logged'
    api.getAccountInformations (account) ->

  else
    console.log 'failed to login'
