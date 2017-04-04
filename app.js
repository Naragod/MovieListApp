
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var routes = require('./custom_modules/routes');
var gameRoutes = require('./custom_modules/gameRoutes');


//Port Number
var portN = 3000;

//****************************************************************
//Connections


//****************************************************************
//Template settings

//If a template engine is needed use commented code below.
app.set('view engine', 'ejs');
app.set('views', './html');

//****************************************************************
//Middleware

//For parcing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true})); 

//Sessions.
// Must be called before routes so that
//They may be used by the routes module
app.use(sessions({
	cookieName: 'userInfo',
	secret: 'sefsfrgkerereerfere23423fwd',
	duration: 5 * 60 * 1000,
	activeDuration: 1 * 60 * 1000
}));

//Check Session during every request.
app.use(routes.checkSession);

//Handles all routes
app.use(routes);
app.use(gameRoutes);

//Handles Static files
//This is the directory node will look in when fetching static files such as css and js
app.use(express.static(__dirname + '/'));


//****************************************************************
//Application


//Binds and listens to portN
var server = app.listen(portN, function () {	
	console.log('Example app listening on port ' + portN);

	setTimeout(function(){
		//Ends connection
		//dbHandler.endConnection(connection);
		console.log('Killing server connection and quitting.');
		process.exit();

	}, 300000); //Terminates server and connection after 3 minutes

});
