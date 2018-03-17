var mysql = require('./mysql');


exports.signupRedirect = function(req,res)
{
	res.render('ejs_signup');
}
exports.signup =function (req,res)
{
	var firstname = req.param('firstname');
	var lastname = req.param('lastname');
	var email = req.param('email');
	var password = req.param('pass');
	var rpass = req.param('rpass');
		
	if(firstname===undefined||password===null||email===null||password===null||rpass===null)
		{
			res.render('ejs_errorpage');
		}
		
//	var connection = mysql.createConnection('localhost://root:alkadudhia@localhost/ebay');
//	connection.connect();	
	//var queryString = 'INSERT into person (firstName,lastName,email,password,isVerified,registrationDate,modifiedDate,isactive) values ("'+firstname+'","'+lastname+'","'+email+'","'+password+'","1",Now(),Now(),1);'
	var queryString = 'INSERT into person (firstName,lastName,email,password,isVerified,registrationDate,modifiedDate,isactive) values ("'+firstname+'","'+lastname+'","'+email+'",md5("'+password+'"),"1",Now(),Now(),1);'
	console.log(queryString);
	mysql.fetchData( function(err, results) {
	    if (err) 
	    	{
	    	console.log(err);
	    	res.render('ejs_errorpage');   	
	    	}
	    else
	    	{
	    	if(results.length===0)
	    	{
	    		
	    		response.render();  
	    		
	    	}
	    	
	    	else
	    		{
	    		req.session.firstname=firstname;
	    		req.session.email=email;
	    		console.log('user created');
	    		var sqlFetchUserid="select userid from person where email='"+email+"'";
	    		mysql.fetchData(function(err,results){
	    			
	    			if(err)
	    				{
	    				throw err;
	    				}
	    			else
	    				{
	    				var userid=results[0].email;
	    				req.session.userid=userid;
	    				res.render('home');
	    				}
	    		},sqlFetchUserid);
	    		
	    		
	    	
	    		//res.send('2');
	    		
	    		}
	    
	    	}
	  },queryString);

	

};

exports.checkemail = function(req,res)
{
	var email=req.param('email');
	var query='Select * from person where email="'+email+'";';
	mysql.fetchData(function(err,result)
			{
				if(err)
			{
					res.send(false);
			}
					else if(result.length==0)
			{
							res.send(true);
			}
		else
			{
					res.send(false);
			}
			},query);
	};

exports.getProfilePage =function (req,res)
{
	var email=req.session.loggedInUser;
res.render('ejs_updateProfile.ejs',{Email :email});
}

exports.getProfileData =function (req,res)
{

	//var email=req.param('Email');
	var email=req.session.loggedInUser;
	var query = 'Select * from person where email="'+email+'";';
	mysql.fetchData(function(err,result)
		{
			if(err)
				{
				console.log(err);
				}
			else
				{
				
				res.send(result);
			
				}
		},query
	
	);
};




exports.updateProfile =function (req,res)
{
	
	var firstname = req.param('firstname');
	var lastname = req.param('lastname');
	var email = req.param('Email');
	var password = req.param('password');
	var country= req.param('Country');
	var city= req.param('city');
	var zip= req.param('zip');
	var state= req.param('state');
	var phone= req.param('phone');
	var address1= req.param('address');
	var address2= req.param('address2');
	
		
	if(firstname==null||password==null||email==null||password==null)
		{
			res.render('ejs_errorpage');
		}
		
	var queryString = 'Update person set firstName="'+firstname+'",lastName="'+lastname+'",email="'+email+'",password=md5("'+password+'"),city="'+city+'",zipcode="'+zip+'",state="'+state+'",phone="'+phone+'",address1="'+address1+'",address2="'+address2+'",country="'+country+'" where email="'+email+'";';
	console.log(queryString);
	mysql.fetchData(function(err, results) {
	    if (err) 
	    	{
	    	console.log(err);
	    	res.render('ejs_errorpage');   	
	    	}
	       	
	    	else
	    		{
	    		
	    		res.render('home');
	    		
	    		}
	    
	    	
	  },queryString);

	

};
