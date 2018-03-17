var mysql = require('mysql');
var register = require('./mysql');

exports.getPendingPaymentsPage=function(req,res)
{
res.render('ejs_getPendingPayments');	
}

exports.getPendingItems = function(req,res)
{
	var user = 1;
	var query = 'Select orderId,`order`.datePlaced,amount,product.`name` from `order` inner join auction on `order`.auctionId = auction.auctionId inner join product on auction.productId = product.productId and isPaid = 0 and orderedBy = "'+user+'";';
	register.fetchData(function(err,result)
{
		if(err)
			{
			
				res.render(ejs_errorpage.ejs);
			
			}
		else
			{
			
			res.send(result);
			}

},query);
};