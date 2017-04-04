var mysql = require('mysql');

module.exports = {

	setConnection : function(host, user, pass, db){
		//Sets Connection
		var connection = mysql.createConnection({
			host : host,
			user : user,
			password : pass,
			database : db
			//Add more fields if needed.
		});

		return connection;
	},

	connectToDB : function(connection, callback){
		//Variable storing the success of the connection as true or false.
		var result = 'undefined';
		//Connects to Database
		connection.connect(function(err){
			if(!err){
				console.log("Connection Successful.");
				result = true;
			}
			else{
				//Terminate application if connection cannot be established.
				console.log("Connection Could not be Established.");
				result = false;
			};
		});
		
		//Error checking as sometimes a parameter might not be passed and callback might be undefined.
		if(callback){
			callback(result);
		};
	},

	endConnection : function(connection){
		console.log("Connection Terminated.");
		connection.end();
	},

	//Table refers to the database table needed
	//SELECT first from table WHERE second = 'entry'
	//From the column called FIRST in the table named TABLE it picks the row named SECOND that has the value of ENTRY
	getEntry : function(connection, table, first, second, entry, callback){
		connection.query('SELECT ' + first + ' from ' + table + ' WHERE ' + second + ' = ' + '\x22' + entry + '\x22', function (err, rows){
			if(!err){
				var result = null;
				if(typeof rows[0] !== 'undefined'){
					result = rows[0][first];
				};
				callback(result);
			}
			else{
				console.log("Rows variable is likely undefined.");
			};
		});
	},

	//Returns all the rows of the table selected
	getTable : function (connection, table, callback){
		connection.query('SELECT * from ' + table, function (err, rows){
			callback(rows);
		});
	},

	query : function (connection, query){
		connection.query(query);
	},
	
	pauseConnection : function (connection, callback){
		connection.pause();
		console.log('Connection Paused.');
		if (typeof callback == 'undefined'){
			callback = 'SOMETHING';
		}
		else{
			callback();
		}
	},

	resumeConnection : function (connection, callback){
		connection.resume();
		console.log('Connection Resumed.');
		if(typeof callback == 'undefined'){
			callback = 'SOMETHING'
		}
		else{
			callback();
		};
	}

};