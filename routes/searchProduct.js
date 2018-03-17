var mysql = require('mysql');
var register = require('./mysql');


exports.searchProducts = function(req,res)
{
	var parameter=req.param('searchParam');
	var status = req.param('type');
	parameter = "%"+parameter+"%";
	status=status-1;
	var query;
	
	if(status==-1)
		{
	query='Select name,productId,description,price from product where name Like "'+parameter+'" and quantity > 0 ;';
	
			
		}
	else if(status>-1)
		{
		
		query='Select name,productId,description,price from product where status='+status+' and quantity>0 and name like "'+parameter+'"';
		}
			register.fetchData(function(err,result)
		{
		if(err)
			{
				console.log(err);
				}
		else
			{
				res.render('ejs_ProductSearchResults.ejs',{products : result});
			
				}
			},query);
};