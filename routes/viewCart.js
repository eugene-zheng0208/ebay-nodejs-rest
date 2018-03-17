var register = require('./mysql');
var fs = require('fs-extra');
var date = require('date-utils');
var redis = require('redis');
var client = redis.createClient(6379, "127.0.0.1");
var cartCaching=require('./cartCaching');
exports.viewCart=function(req,res){
	
	res.render('ejs_viewCart.ejs');
	
	};
	
exports.getCart=function (req,res)
{
	var session = req.session;
	var session = req.session;
	//session.products=['1','2','3','4'];
	//session.quantity = ['20','30','40','50'];
	//session.firstname =['Rutvik','Buyer2','Harshit','Ankit'];
	
	var cart=req.session.cart;
	if(cart===undefined)
		{
		var nodata={};
		res.send(nodata);
		}
	else
		{
		var items=req.session.cart.items;
		console.log('items');
		console.log(items);
		console.log(req.session.products);
		var userid=req.session.userid;
		var product='' ;
		if(items.length>0)
		{
			console.log('in if');
		//= "'"+session.products[0]+"',";
		for(var i=0;i<items.length;i++)
			
			{
			if(i==(items.length-1))
				{
			product =  product + "'"+items[i].products+"'";
				}
			else
				{
				product = product + "'"+items[i].products+"',";
				}
				if(product.length>0)
					{
					var query = 'Select product.productId,product.name AS productname ,product.description AS productdescription,product.image,product.addedby, product.price,person.firstName  AS seller from ebay.product inner join ebay.person on person.userId = product.addedBy where productId IN ('+product+');';
					console.log(query);	
					
					register.fetchData(function(err,result)	{
						
						if(err)	{
									console.log(err);
									var nodata={};
									res.send(nodata);
								}
						else{
							
							for(var i=0;i<result.length;i++)	{
								
								result[i].firstname=items[i].firstname;
								result[i].quantity=items[i].quantity;
								
								}
							//console.log(req.session.products);
							console.log(result);
							console.log("length"+result.length);
								res.send(result);
							}
						
							},query	);
					}
				else
					{
					console.log('in else , no product array');
					var nodata='';
					res.send(JSON.parse(nodata));
					}
			
			
			}
		}
		
		else
			{
		console.log('in else');
			
			cartCaching.getCartFromCache(function(error,results){
				console.log('results');
				console.log(results);
				if(results!=null)
					{
					if(results.length>0)
					{
					items=results;
					}
				else
					{
					
					}
				console.log('items');
				console.log(items);
				console.log(items.length);
				req.session.cart.items=results;
				if(items.length>0)
				{
					console.log('in if');
				//= "'"+session.products[0]+"',";
				for(i=0;i<items.length;i++)
					
					{
					console.log('in for loop');
					if(i==(items.length-1))
						{
					product =  product + "'"+items[i].products+"'";
						}
					else
						{
						product = product + "'"+items[i].products+"',";
						}
					}
				}
			
				
				if(product.length>0)
				{
				var query = 'Select product.productId,product.name AS productname ,product.description AS productdescription,product.image,product.addedby, product.price,person.firstName  AS seller from ebay.product inner join ebay.person on person.userId = product.addedBy where productId IN ('+product+');';
				console.log(query);	
				
				register.fetchData(function(err,result)	{
					
					if(err)	{
								console.log(err);
								var nodata='';
								res.send(JSON.parse(nodata));
							}
					else{
						
						for(var i=0;i<result.length;i++)	{
							
							result[i].firstname=items[i].firstname;
							result[i].quantity=items[i].quantity;
							
							}
						//console.log(req.session.products);
						console.log(result);
						console.log("length"+result.length);
							res.send(result);
						}
					
						},query	);
				}
			else
				{
				console.log('in else , no product array');
				var nodata={};
				res.send(nodata);
				}
					}
				else
					{
					var nodata={};
					res.send(nodata);
					}
				
				
			},userid);
			}
		
		}
	
	

	
};

exports.removeFromCart=function(req,res){
	var items=req.session.cart.items;
	var session = req.session;
	var productId = req.param('productId');
	console.log(req.session.products);
	console.log(productId);
	
    var index = null;
    for (var i =0; i < items.length; i++) {
    	
        if (items[i].products == productId) {
            index = i;
            console.log(index);
            break;
        }
    }
    if (index !== null) {
    	items.splice(index, 1);
    	/*session.quantity.splice(index, 1);
    	session.firstname.splice(index, 1);*/
    }
	console.log(req.session.products);
	var cart=req.session.cart;
	var userid=req.session.userid;
	cartCaching.addToCart(function(err,results){
		
		res.redirect('/ViewCart');
		
	},cart.items,userid);
	
	
	};