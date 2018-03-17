var mysql = require('./mysql');


exports.getSubCategory =function (req,res)
{
	var categoryid = req.param('categoryId');
//	var connection = mysql.createConnection('localhost://root:alkadudhia@localhost/ebay');
	//connection.connect();	
	if(categoryid==-1)
		{
		res.send(0);
		}
	var queryString = 'Select * from subcategory where categoryid ='+categoryid+';';
	console.log(queryString);
	mysql.fetchData( function(err, results) {
	    if (err) 
	    	{
	    	
	    	res.send('0');
	    	res.render('ejs_signinerrorpage.ejs');
	    	
	    	}
	    else
	    	{
	    	
	    	if(results.length===0)
	    	{
	    		res.render('ejs_signinerrorpage.ejs')
	    		
	    	}
	    		
	    	else
	    	
	    	{
	    		res.send(results);
	    		
	    		
	    	}
	    	}
	  },queryString);

	};