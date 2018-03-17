/**
 * New node file
 */
var mysql=require('./mysql');
var signin=require('./signin');
var date = require('date-utils');
exports.paymentRedirect=function(req,res)
{
	
	var userid=req.session.userid;
	if(userid==null)
		signin.signinRedirect(req,res);
	else
		res.render('payment');	



}

exports.showCheckout=function(req,res)
{
	var items=req.session.cart.items;
	var total=0;
	var product='';
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
	}

var query = 'select price from product  where productId IN ('+product+');';
var results;

		mysql.fetchData(function(err,results){
			
			if(err)
				throw err;
			else
				{
				if(results!=null)
					{
						console.log('prices');
						console.log(results);
						for(i=0;i<results.length;i++)
						{
						total+=results[i].price;
						
						}
						console.log('total price'+total);
						res.render('payment',{price:total});
					}
				}
			
		},query);
	

}

exports.makePayment=function(req,response)
{
	var totalAmount = req.param('totalAmount');
	var paymentRadio = req.param('paymentRadio');

	var cardHolderFirstname = req.param('cardHolderFirstname');
	var cardHolderLastname = req.param('cardHolderLastname');
	var creditcardNumber = req.param('creditcardNumber');
	var ccv = req.param('ccv');
	var ddlExpirationMonth = req.param('ddlExpirationMonth');
	var ddlExpirationYear = req.param('ddlExpirationYear');
	var buyerFirstname = req.param('buyerFirstname');
	var buyerLastname = req.param('buyerLastname');
	var buyerEmail = req.param('buyerEmail');
	var addressLine1 = req.param('addressLine1');
	var addressLine2 = req.param('addressLine2');
	var city = req.param('city');
	var state = req.param('state');
	var zipcode = req.param('zipcode');
	var country=req.param('Country');
	console.log(totalAmount+paymentRadio+cardHolderFirstname+cardHolderLastname+creditcardNumber+creditcardNumber+ccv+ddlExpirationMonth+ddlExpirationYear+buyerFirstname+buyerLastname+buyerEmail+addressLine1+addressLine2+city+state+zipcode+country);
	var orderid='';
	var userid=req.session.userid;
	var d = new Date();
	Number.prototype.padLeft = function(base,chr)
	{
	var  len = (String(base || 10).length - String(this).length)+1;
	return len > 0? new Array(len).join(chr || '0')+this : this;
	}
	 var dformat1 = [d.getFullYear(),(d.getMonth()+1).padLeft(),
		               d.getDate().padLeft()
		               ].join('/') +' ' +
		              [d.getHours().padLeft(),
		               d.getMinutes().padLeft(),
		               d.getSeconds().padLeft()].join(':');
					console.log(dformat1);
					var sql="insert into `order`(orderedby,dateplaced,amount,isPaid,paymentmode) values ("+userid+",'"+dformat1+"',"+totalAmount+",1,'"+paymentRadio+"');"
					mysql.fetchData(function(error,results)
							{
						
							if(error)
								throw error;
							else
								{
								if(results!=null)
									{
									mysql.fetchData(function(error,results)
											{
										
											if(error)
												throw error;
											else
												{
												if(results!=null)
													{
													console.log(results);
													orderid=results[0].max;
													console.log("orderid"+orderid);
													
													var sql2='';
													var items=req.session.cart.items;
													for(i=0;i<items.length;i++)
													{
														
														
															if(i==items.length-1)
																{
															sql2=sql2+" ("+orderid+","+userid+","+items[i].products+","+items[i].quantity+");";
																}
															else
																{
																sql2=sql2+" ("+orderid+","+userid+","+items[i].products+","+items[i].quantity+"),";
																}
														
													}
													sql2="insert into `orderitem` (orderId,soldBy,productId,quantity) values "+sql2;
													console.log(sql2);
													mysql.fetchData(function(err,results)
															{
																if(err)
																	throw err;
																else
																	{
																	if(results!=null)
																		
																		{
																			var updateSql="update person set address1='"+addressLine1+"',address2='"+addressLine2+"',city='"+city+"',state='"+state+"',zipcode='"+zipcode+"',country='"+country+"' where userid="+userid;
																			mysql.fetchData(function(err,results){
																				if(err)
																					{
																					throw err;
																					}
																				else
																					{
																					if(results!=null)
																						{
																						console.log(results);
																						var quantitySql='';
																						
																						var items=req.session.cart.items;
																						
																						//quantitySql="insert into `orderitem` (orderId,soldBy,productId,quantity) values "+quantitySql;
																						for(i=0;i<items.length;i++)
																						{
																							if(i==(items.length-1))
																							{
																								quantitySql =  quantitySql + "'"+items[i].products+"'";
																							}
																						else
																							{
																							quantitySql = quantitySql + "'"+items[i].products+"',";
																							}
																						
																							
																							
																						}
																						quantitySql="update product set quantity=quantity-1 where productid in ("+quantitySql+");";
																						console.log(quantitySql);
																						mysql.fetchData(function(err,results){
																							if(err)
																								throw err;
																							else
																								{
																								if(results!=null)
																									{
																									var tracking='1234567890';
																										var shippingSql="   insert into shippinginfo(address1,address2,city,state,zipcode,country,trackingNumber) values('"+addressLine1+"','"+addressLine2+"','"+city+"','"+state+"','"+zipcode+"','"+country+"','"+tracking+"')";
																										mysql.fetchData(function(err,results){
																											if(err)
																												{
																												throw err;
																												}
																											else
																												{
																												if(results!=null)
																													{
																														var shippingid='';
																														mysql.fetchData(function(err,res){
																															shippingid=res[0].max;
																															console.log("shipping"+shippingid);
																															
																															var transactionSql="insert into transaction(buyerid,orderId,shippingId) values("+userid+","+orderid+","+shippingid+");";
																															mysql.fetchData(function(err,results){
																																if(err)
																																	throw err;
																																else
																																	{
																																	if(results!=null)
																																		{
																																			mysql.fetchData(function(err,res){
																																				
																																				if(err)
																																					throw err;
																																				else
																																					{
																																					if(res.length>0)
																																						{
																																						
																																						}
																																					else
																																						{
																																								var sellerSql="insert into customer(personid) values("+userid+")";
																																							mysql.fetchData(function(err,results){
																																								
																																								
																																							},sellerSql)
																																						}
																																						var trackingid='1234567890',confirmationid='a12345';
																																						response.render('paymentDone',{confirmationid:confirmationid,trackingid:trackingid});
																																					}
																																			},"select customerid from customer where personid="+userid);
																																		}
																																	}
																															},transactionSql)
																															
																															
																															
																														},"select max(shippingid) as max from shippinginfo");
																													}
																												}
																										},shippingSql);
																									}
																								}
																							
																						},quantitySql)
																						}
																					}
																			},updateSql)
																		}
																	}
														
															},sql2);
													
													}
												}
											},"select MAX(orderid) as max from `order` ");
									}
								}
						
							},sql);
	
	


	
	// add into order table
	// add into orderitem table 
	// update person table 
	// update product quantity
	//add shiping info
	// add into seller
	//add into shipping table
	//add into transaction info
}