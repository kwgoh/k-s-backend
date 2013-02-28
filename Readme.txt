Uploading requires GAE Python to be installed: https://developers.google.com/appengine/docs/python/overview

Before uploading, you must have created an application in Google App Engine.

Take note of the application identifier you used when creating the application, as well as the site URL derived from said identifier

(e.g. if the identifier is "XYZ", the site URL will be "XYZ.appspot.com")

Change the following files prior to uploading:

app.yaml - at line 1, change the value under "application" to your application's identifier.

app\js\angular\sketch-controller.js - at line 10, change the value under "$scope.remote_url" to your application's site URL.