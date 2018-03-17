var mysql = require('./mysql');

exports.getCategoryPage =function (req,res)
{
res.render('ejs_addproduct');
}
exports.getCategory =function (req,res)
{
//	var username = req.param('userid');
//	var password = req.param('password');
//	var connection = mysql.createConnection('localhost://root:root@localhost/ebay');
	//connection.connect();	
	var queryString = 'Select categoryId,name from category';	 
	console.log(queryString);
	mysql.fetchData(function(err, results) {
	    if (err) 
	    	{
	    	console.log(err);
	    	res.send('0');
	    	res.render('ejs_signinerrorpage.ejs')
	    	
	    	}
	    else
	    	{
	    	
	    	if(results.length===0)
	    	{
	    		console.log("no results");
	    		res.render('ejs_signinerrorpage.ejs')
	    		
	    	}
	    		
	    	else
	    		{
	    		console.log(results);
	    		res.send(results);
	    		}
	    	}
	  },queryString);

	

};

