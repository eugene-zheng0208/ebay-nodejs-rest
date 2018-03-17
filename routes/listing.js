/**
 * New node file
 */
var mysql=require('./mysql');
var signin=require('./signin');
exports.listingRedirect=function(req,res)
{
	var userid=req.session.userid;
	if(userid==null)
		signin.signinRedirect(req,res);
	else
		res.render('userListings');	

}
exports.getProductListing=function(req,res)
{
	var userid=req.session.userid;
var sql="select productid,name,description,price,quantity,isAuction from product where addedBy="+userid;
mysql.fetchData(function(error,results){
	
	if(error)
		throw error;
	else
		{
		if(results!=null)
			{
			
			console.log('product listing');
			
			res.send(results);
			
			}
		}
	
},sql);

}