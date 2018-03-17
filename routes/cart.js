/**
 * New node file
 */
var mysql=require('./mysql');
var cartCaching=require('./cartCaching');
var signin=require('./signin');

exports.addToCart=function(req,response)
{
var temp={},temp2={},temp3={};	
var productid=req.param("productid");
var quantity=req.param("qty");
console.log('productids'+req.session.products);
console.log('quantity'+req.session.quantity);
//roducts=[productid];
var userid=req.session.userid;
if(userid===undefined)
{
	console.log(" in undefines");
	response.send("empty");
}

else
	{
	var pids = []; // initialise an empty array
	var temp = '';
	var cart=req.session.cart;
	console.log(req.session.cart);
	cart.items.push({
		"products":productid,
		"quantity":quantity,
		"firstname":req.session.firstname
		
	});

	req.session.cart=cart;
	console.log(req.session.cart);

	if(req.session.products.length==0)
		req.session.products=productid;
	else
		{
	 temp=req.session.products;
	temp=temp.concat(productid);
	req.session.products=temp;
	console.log(req.session.products);
		}
	pids.push(req.session.products);
	console.log('pids'+pids);
	if(req.session.quantity.length==0)
		req.session.quantity=quantity;
	else
		{
	temp2=req.session.quantity;
	temp2[temp2.length]=quantity;
	req.session.quantity=temp2;

		}
	if(req.session.firstname=='')
		req.session.firstname='harshit2';
	else
		{

		
	temp3=req.session.firstname;
	temp3[temp3.length]='harshit';
	req.session.firstname=temp3;
		}
	//var products=req.session.products;
	//req.session.quantity=quantity;
	console.log('productids'+req.session.products);
	console.log('quantity'+req.session.quantity);
	var cart=req.session.cart;
	console.log('cart'+cart.items);
	var userid=req.session.userid;

	cartCaching.addToCart(function(err,results){
		response.send(req.session.products);
		
	},cart.items,userid);

	}


}