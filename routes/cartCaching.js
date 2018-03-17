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


function addToCart(callback,cart,userid){
	
	var redisdata = null;
	var key="cart"+userid;
			client.get(key, function(err, reply) {

			//console.log("Value " + JSON.stringify(reply));

				redisdata = JSON.stringify(cart);
				client.set(key,redisdata, redis.print);
				console.log("cart added to cache , userid"+userid);
				callback(err, reply);

		});

}	

exports.getCartFromCache=function (callback,userid)
{
	var key="cart"+userid;
	client.get(key, function(err, reply) {

		//console.log("Value " + JSON.stringify(reply));
		if (typeof reply == "undefined" || reply == null || reply == "") {
			var cart=JSON.parse(reply);
			callback(err,cart);
		}
		else
			{
			console.log(reply);
			var cart=JSON.parse(reply);
				callback(err,cart);
			}

	});
	

}
exports.addToCart=addToCart;

