querystring = require('querystring')
https = require('https')
fs = require('fs')
request = require('request')

class DofusAPI
  constructor: ->
    @rootUrl = 'http://www.dofus.com/'
    @logged = false

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
        callback { success: true }
      else
        callback { success: false }

window.DofusAPI = DofusAPI

api = new DofusAPI()
api.login "justarandomaccount", "justarandompassword", (result) ->
  if result.success
    console.log 'logged'
  else
    console.log 'failed to login'
