
var mysql=require('./mysql');
var home=require('./home');


exports.signinRedirect = function(req,res)
{
res.render('ejs_signin');	
}
exports.signin =function (req,res)
{
	var username = req.param('userid');
	var password = req.param('password');
	//var connection = mysql.createConnection('localhost://root:root@localhost/ebay');
	//connection.connect();	
	var queryString = 'SELECT email,firstname,userid FROM person where email="'+username+'" and password=md5("'+password+'") and isactive=1';	 
	console.log(queryString);
	mysql.fetchData(function(err, results) {
	    if (err) 
	    	{
	    	
	    	res.send('0');
	    	res.render('ejs_signinerrorpage.ejs')
	    	
	    	}
	    else
	    	{
	    	
	    	if(results.length===0)
	    	{
	    		res.render('ejs_signinerrorpage.ejs')
	    		
	    	}
	    		
	    	else
	    		{
	    		req.session.loggedInUser=results[0].email;
	    		req.session.firstname=results[0].firstname;
	    		req.session.userid=results[0].userid;
	    		console.log('session'+(req.session.loggedInUser));
	    		console.log('session'+JSON.stringify(req.session.loggedInUser));
	    		console.log(results[0].firstname+results[0].email);
	    	//	req.params.firstname="harshit";
	    		//req.params.email="hpj1992@gmail.com";
	    			var query='Update person set lastLogin=Now() where email="'+username+'";';
	    		
	    		mysql.fetchData(function(err,result)
	    				{
	    			if(err)
	    				{
	    				console.log(err);
	    				}
	    			else
	    				{
	    				//res.redirect("HomeScreen.ejs");
	    				home.home(req,res);
	    				}
	    		},query);
	    	
	    		//res.send(results);
	    		}
	    	}
	  },queryString);

	console.log(username);	

};


