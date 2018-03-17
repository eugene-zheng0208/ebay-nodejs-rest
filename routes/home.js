/**
 * New node file
 */
var mysql=require('./mysql');

exports.home=function(req,res)
{
	console.log('in home sign in');
	//console.log(req.session.loggedInUser);
var sql="select name,categoryid from category";
var dataCategories,dataSubcategories;


mysql.fetchData(function(error,categories)
		{
	if(error)
		throw error;
	else
		if(categories!=null)
			{
			dataCategories=categories;
			console.log("categories"+dataCategories);
			var sqlSubcat="select name,categoryid,subcategoryid from subcategory order by categoryid "
			mysql.fetchData(function(error,subcategories){
				if(error)
					throw error;
				else
					{
					if(subcategories!=null)
						{
						
						console.log(subcategories);
						dataSubcategories=subcategories;
						//console.log(req.params('firstname'));
						var firstname='',email='';
						req.session.products='';
						req.session.quantity='';
						
						console.log('forstname'+req.session.firstname);
						if(req.session.firstname!=null)
							firstname=req.session.firstname;
						else
							firstname='';
						
						var cart = {
							    items: []
							};
						
						req.session.cart=cart;
						
						
						
						
						res.render('home',{categories:dataCategories,subcategories:dataSubcategories,firstname:firstname,email:email});
						
					/*	mysql.fetchData(function(error,results){
						firstname=results[0].firstname;	
							email=results[0].email;
							console.log(firstname);
							console.log(email);
							//console.log(req.session.loggedInUser);
							
						},"select firstname,email from person where email='hpj1992@gmail.com'");
						*/
						//res.send(subcategories);
						}
					}
				
				
			},sqlSubcat);
			}
	
},sql);


}