
//Variables

var express = require('express');
var gameRouter = express.Router();
var dbHandler = require("./dbhandler")


//Check if connection is established, and establish it if there is none.
var checkConnection = function(req, res, next){
	//Check if connection is established, and establish it if there is none.
	if(!connection){
		connection = dbHandler.setConnection('localhost', 'root', 'mateo', 'dbmyapp');

		//Error Handling. In case server cannot connect to database it will terminate the connection immediatelly.
		dbHandler.connectToDB(connection, function (result){
			if(!result){
				//End Connection.
				dbHandler.endConnection(connection);
				//Redirect user to the Error page.
				res.redirect('/error');
			}
		});
	}

	next();
};



//Dsiplays the Games Page
gameRouter.get('/games', function (req, res){
	res.render('games');
});

//Displays the Snake Game Page
gameRouter.get('/games/snake', checkConnection, function (req, res){
	dbHandler.getEntry(connection, 'users', 'snakescore', 'username', 'zulma', function(highScore){

		res.render('games/snake/snake', 
			{highS: highScore});
	});
	
});

//Displays the Tic-Tac-Toe Game Page
gameRouter.get('/games/tic-toe', function (req, res){
	res.render('games/tic-toe/tic-toe');
});

module.exports = gameRouter;























