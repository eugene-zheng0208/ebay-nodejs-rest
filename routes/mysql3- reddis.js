//Without connection pooling

var ejs= require('ejs');
var mysql = require('mysql');
var redis = require('redis');
var client = redis.createClient(6379, "127.0.0.1");


function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'ebay'
	});
	return connection;
}


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	var redisdata = null;
			client.get(sqlQuery, function(err, reply) {

			//console.log("Value " + JSON.stringify(reply));

			if (typeof reply == "undefined" || reply == null || reply == "") {
				console.log("Fetching from database");
				connection.query(sqlQuery, function(err, rows, fields) {
					if(err){
						console.log("ERROR: " + err.message);
					}
					else 
					{	// return err or result
						redisdata = JSON.stringify(rows);
						client.set(sqlQuery,redisdata, redis.print);
						callback(err, rows);
					}
				});
				console.log("\nConnection closed..");
				connection.end();

			} else {
				console.log("Got from cache");
				redisdata = JSON.parse(reply);
				customerresult = redisdata;
				callback(err,redisdata);
			}
			// console.log("movie"movresult);

		});

		

	/*connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();*/
}	

exports.fetchData=fetchData;


/*
 * GET users listing.
 */

exports.list = function(req, res) {
	var redisdata = null;
	req.getConnection(function(err, connection) {

		client.get("stringcustomersdata", function(err, reply) {

			//console.log("Value " + JSON.stringify(reply));

			if (typeof reply == "undefined" || reply == null || reply == "") {
				console.log("Fetching from database");
				var query = connection.query('SELECT * FROM customer',
						function(err, rows) {

							if (err) {
								console.log("Error Selecting : %s ", err);
							} else {
								var query1 = connection.query(
										'SELECT * FROM customer limit 500', function(
												err1, rows1) {

											if (err1) {
												console.log("Error Selecting : %s ",
														err1);
											} else {
												redisdata = JSON.stringify(rows1);
												client.set("stringcustomersdata",
														redisdata, redis.print);
											}

										});
								
								res.render('customers', {
									page_title : "Customers - Node.js",
									data : rows
								});
							}

						});

			} else {
										console.log("Got from cache");
				redisdata = JSON.parse(reply);
				customerresult = redisdata;
				res.render('customers', {
					page_title : "Customers - Node.js",
					data : customerresult
				}, function(err, result) {

					if (!err) {
						res.end(result);
					} else {
						res.end('an error has occured');
						console.log(err);
					}
				});
			}
			// console.log("movie"movresult);

		});

		
	});

};
/**
 * New node file
 */
