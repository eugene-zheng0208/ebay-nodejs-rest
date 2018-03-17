/**
 * New node file
 */
var mysql=require('./mysql');
exports.subcategory=function(req,res)
{
	
	
	var subcategoryid=req.param('subcategoryid');
	console.log(subcategoryid);
	var sql="select name,description,price,productid from product where subcategoryid="+subcategoryid+" and isactive=1 and quantity>0";
	
	mysql.fetchData(function(error,products){
		
		if(error)
			throw error;
		else
			if(products!=null)
				{
				//console.log(products);
				res.render('products',{products:products});
				//res.send(products);
				}
		
		
	},sql);


}