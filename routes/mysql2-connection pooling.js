// with generic connection pooling 


var mysql =  require('mysql');                  
  var pool =  mysql.createPool({
	  host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'ebay',
	    max      : 10
  });	
  
  
  function fetchData(callback,sqlQuery){
		
		console.log("\nSQL Query::"+sqlQuery);
		
		//var connection=getConnection();
		
		 pool.getConnection(function(err, connection){
			  connection.query(sqlQuery,  function(err, rows){
			  	if(err)	{
			  		throw err;
			  	}else{
			  		console.log( rows );
			  		callback(err, rows);
			  	}
			  });
			  
			  connection.release();
			});
	}	

	exports.fetchData=fetchData;
  
 