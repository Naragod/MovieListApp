
//Variables

var express = require('express');
var router = express.Router();
var dbHandler = require('./dbhandler');

//Import game routes
var gameRouter = require('./gameRoutes');

//Need to set connection as a global variable. Set it to false as there is yet no connection.
var connection = false;

//Connections
//Error Checking. This function will ensure that there is a connection and if there is not, it will create one.
//This function will run anytime a connection is needed to be established.
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

//MiddleWare, that checks user is logged in, during every page request.
var checkLogin = function (req, res, next){
	if(!req.user){
		res.redirect('/login');
	}
	else{
		next();
	}
};

//Routes

//Checks Session
router.checkSession = function (req, res, next){
	if(req.userInfo && req.userInfo.userName){
		dbHandler.getEntry(connection, 'users', 'username', 'username', req.userInfo.userName, function (result){
			if(result !== null){
				req.user = req.userInfo;
			}

			next();
		});
	}
	else{
		next();
	}
};


//Displays Home Page
router.get('/', function (req, res){
	var page = "login";
	var message = "Please Log In.";
	if(typeof req.userInfo.userName !== 'undefined'){
		message = "Welcome " + req.userInfo.userName;
		page = "dashboard";
	}

	//Loads the html page, subsituting the values of page and message for those above
	res.render('index', {
		page: page,
		message: message
	});
});


//Display Login Page
router.get('/login', checkConnection, function (req, res){
	res.render('login');
});


//Verifies Correct Login Information
router.post('/login', checkConnection, function (req, res){
	//Obtains user column from table database
	//checkEntry(connection, table, column, entry)
	var userEntry, passEntry;

	dbHandler.getEntry(connection, 'users', 'username', req.body.username, function (result){
		userEntry = result;

		dbHandler.getEntry(connection, 'users', 'password', req.body.password, function (result){
		passEntry = result;

			//Checking needs to be done inside the getEntry functions. Since
			//They run asynchonously, any check performed outside of these functions,
			//Will return undefined as, it will not have read the database.
			if(userEntry == req.body.username && passEntry == req.body.password){
				req.userInfo.userName = userEntry;
				res.redirect('/dashboard');
			}
			else{
				res.send('<h1>Try Again.</h1>');
			}
		});
	});

});


//Dashboard and personal user page
//Passing in the middleware function checkLogin to see if logged in or not
router.get('/dashboard', checkConnection, checkLogin, function (req, res){
	if(req.userInfo && req.userInfo.userName){
		dbHandler.getEntry(connection, 'users', 'username', 'username', req.userInfo.userName, function(result){
			if(result !== null){
				res.render('dashboard', {
					user:req.userInfo.userName
				});
			}
			else{
				req.userInfo.reset();
				res.redirect('/login');
			}
		});
	}
});


//Movies Page
var moviesTable = [];
router.get('/movies', checkConnection, function (req, res){

	//Reads the data from the database and displays it
	dbHandler.getTable(connection, 'movies', function (result){
		moviesTable = result;

		//Error checking. Most likely as a result of no database connection.
		if(typeof moviesTable != typeof []){
			console.log("Page Could not be Loaded.");
			res.redirect('/error');
		}
		else{
			//The page will be rendered first, before reading
			//The updated database if it is not placed
			//Inside of the getTable function which runs asynchonously
			res.render('movies', {
				items: moviesTable,
				user: "default"
			});
		}
	});
});

//Displays New Movie Entries
router.post('/movies', checkConnection, function (req, res){
	var query = 'INSERT INTO movies (movieName, description) VALUES ("' + req.body.movieName + '", "' + req.body.desc + '")';
	dbHandler.query(connection, query);
	res.redirect('/movies');
});


//Error Page.
//To have a more dynamic error page, it would be best to use sessions to store
//And then load the appropriate error.
router.get('/error', function (req, res){
	res.render('error');
});

//Logs Out User



module.exports = router;
