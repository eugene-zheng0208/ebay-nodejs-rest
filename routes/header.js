
var mysql=require('./mysql');
var extend = require('node.extend');

exports.headerRedirect=function(req,res)
{
res.render('header');	
}
exports.header=function(req,res)
{
	
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
						var firstname='',email='';
						req.session.products='';
						req.session.quantity='';
						if(req.session.firstname!=null )
							firstname=req.session.firstname;
						res.render('header',{categories:dataCategories,subcategories:dataSubcategories,firstname:firstname});
						//var destObject = extend(true,{},dataCategories, dataSubcategories);
						//var data='{"data":'+dataSubcategories+'}';
						//res.send(([dataSubcategories , dataCategories]));
						}
					
					}
				
				
			},sqlSubcat);
			}
	
},sql);


}