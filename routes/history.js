/**
 * New node file
 */

var mysql=require('./mysql');
var signin=require('./signin');

exports.redirect=function(req,res)
{
	var userid=req.session.userid;
	if(userid==null)
		signin.signinRedirect(req,res);
	else
		res.render('history');	
}
exports.getPurchasedProducts=function(req,res)
{
	var userid=req.session.userid;
	
	var sql="select p.name,p.description,p.price,p.isAuction,p.quantity from product p where p.productid in (select productid from orderitem oi,ebay.`order` o where oi.orderid=o.orderid and o.orderedBy="+userid+") ";
	mysql.fetchData(function(error,results)
	{
		if(error)
			throw error;
		else
			{
			if(results!=null)
				{
				console.log(results);
				res.send(results);
				}
			}
	}	, sql);
	
}

exports.getSoldProducts=function(req,res)
{
	var userid=req.session.userid;
	
	var sql="select p.name,p.description,p.price,p.quantity,p.status from product p where productid in (select productid from orderitem oi,ebay.`order` o where oi.orderid=o.orderid and oi.soldBy="+userid+")";
	mysql.fetchData(function(error,results)
	{
		if(error)
			throw error;
		else
			{
			if(results!=null)
				{
				console.log(results);
				res.send(results);
				}
			}
	}	, sql);
	
}

