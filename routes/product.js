/**
 * New node file
 */

var mysql=require('./mysql');
var _ = require('underscore')._;
exports.getAllProductsData=function(req,res)
{
var sql="select productId,name,description,price,avgReview,isAuction,isactive from product";
mysql.fetchData(function(error,results){
	
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
	
	
},sql);

}
exports.updateProductStatus=function(req,res)
{
var userid=req.param("productid");
var status=req.param("status");
var sql="update product set isactive="+status+" where productid="+userid;
mysql.fetchData(function(error,result){
	
	if(error)
		throw error;
	else
		{
		if(result!=null)
			{
			
			console.log("product status changed.");
			}
		}
	
},sql);

}
exports.getAllAuctionProducts=function(req,res)
{

		var sql="select a.auctionId,p.name,a.basePrice,a.datePlaced,a.dateEnds,a.heldBy,per.firstname from auction a,product p,person per where a.productid=p.productid and per.userid=a.heldBy";
		
		mysql.fetchData(function(error,results){
			
			if(error)
				{
				throw error;
				}
			else
				{
				if(results!=null)
					{
					console.log(results);
					res.send(results);
					}
				}
		},sql);	


	

}

exports.displayProductInfo = function(req,res)
{
	
	//I need product Id to be passed in parameters
	var productId = req.param("pid");

	var getProductInfo = "select * from product where productId = '"+productId+"'";	
	var getAuctionInfo = " select * from auction where productId =  '"+productId+"'";	

	mysql.fetchData(function(err2,product){
		if(err2){
			console.log("error occured while fetching product information");
			throw err2;
		}
		else 	{
			console.log("Result Length" + product.length);
			console.log(product[0]);
			//console.log("Auction Value" + product[0].isAuction);
			
			var userId = product[0].addedBy;
			
			var getSellerInfo = "SELECT p.firstName,s.avgReview FROM ebay.person p  " +
					"INNER JOIN ebay.seller s  ON p.userId = s.personId where s.personid = '"+userId+"'";
			
			mysql.fetchData(function(error,seller){

				if(error)
				{
					console.log("error occured while getting seller information");
					throw error;
					res.send({result : "false"});
				}
				else
				{		
					if(product[0].isAuction == 1)
					{
						mysql.fetchData(function(err2,productAuction){
							if(err2){
								console.log("error occured while fetching auction information");
								throw err2;
							}
							else 	{
								
								if(productAuction.length >  0)
									{
									console.log("Result Length" + productAuction.length);
									console.log(productAuction[0]);
									var getBidInfo = "select COUNT(*) as count from bidinfo where auctionId = '"+productAuction[0].auctionId+"'";

									mysql.fetchData(function(error,count){

										if(error)
										{
											console.log("error occured while fetching bidding information");
											throw error;
										}
										else
										{				
											console.log("Result Length" + count.length);								
											console.log(count[0]);
											console.log("count value is " + count[0].count);										
											console.log(productAuction);
											
											var count;
											
											if(count[0].count == 0)
												{
													count = 0;
												}
											else
												{
													count = count[0].count;
												}
											
											var auctionId = productAuction[0].auctionId;
											var dateEnds = productAuction[0].dateEnds;
											var dateStarts = productAuction[0].datePlaced;
														
											res.render('product', {productAuction: productAuction[0] , product: product[0] , dateEnds : dateEnds , 
												datePlaced : dateStarts, auctionId : auctionId, bidCount : count, sellerName : seller[0].firstName, avgReview : seller[0].avgReview});
										}
									},getBidInfo);
									}
								else
									{
										console.log("error occured while fetching auction information");
										throw err2;
									}
							}
						},getAuctionInfo);
					}
					else
					{

						var productAuction = null;
						console.log("In else part");
						
						var datePlaced = null;
						var dateEnds = null;
						
						
					   
						
						res.render('product', {productAuction : productAuction, auctionId : 0,dateEnds : dateEnds ,
							datePlaced : datePlaced , product : product[0] , bidCount : 0 , sellerName : seller[0].firstName, avgReview : seller[0].avgReview});	
					}
				}
			},getSellerInfo);
		}
	},getProductInfo);
};

exports.checkLoggedInUser = function(req,res)
{
	console.log("in the user check");
	//res.send("true");
	var loggedInUser;

	if(req.session != null)
	{
		loggedInUser = req.session.userid;

		if(loggedInUser != null)
			res.send("true");
		else
			res.send("false");
	}
	else
	{
		res.send("false");
	}

};

//To get the latest bid and next minimum bid
exports.getLatestBid = function(req,res)
{

	var auctionId = req.param("auctionId");



	var getBidInfo = "select * from bidinfo where auctionId = '"+auctionId+"' ORDER BY Date(date) desc,Time(date) desc";

	mysql.fetchData(function(error,bids){

		if(error)
		{
			console.log("error occured while fetching bidding information");
			throw error;
			res.send({result : "false"});
		}
		else
		{				
			totalBids = bids.length;
			if(bids.length > 0)
			{
				var latestBid = bids[0].bidPrice;				
				var nextMinimum = latestBid + ((latestBid * 1)/ 100);

				//nextMinimum = Math.ceil(nextMinimum);

				console.log(nextMinimum);
				res.send ({result : "true", nextMinimumBid : nextMinimum , latestBid : latestBid , totalBids : totalBids});
			}
			else
			{
				res.send({result : "false"});
			}
		}
	},getBidInfo);
}

exports.postBid = function(req,res)
{


	console.log("In postBid method");
	var auctionId = req.body.auctionId;
	var bidPrice = req.body.bidPrice;

	Number.prototype.padLeft = function(base,chr)
	{
		var  len = (String(base || 10).length - String(this).length)+1;
		return len > 0? new Array(len).join(chr || '0')+this : this;
	}
	var d = new Date();

	var dformat1 = [d.getFullYear(),(d.getMonth()+1).padLeft(),
	                d.getDate().padLeft()
	                ].join('/') +' ' +
	                [d.getHours().padLeft(),
	                 d.getMinutes().padLeft(),
	                 d.getSeconds().padLeft()].join(':');
	console.log(dformat1);


	var userId = req.session.userid ;//req.session.loggedInUser;

	
	var postBidQuery = "INSERT INTO bidinfo (auctionId,bidBy,bidPrice,date) VALUES ('"+auctionId+"','"+ userId+"','"+ bidPrice+"','"+dformat1+"')";;

	mysql.fetchData(function(error,bids){

		if(error)
		{
			console.log("error occured while posting bidding information");
			throw error;
			res.send({result : "false"});
		}
		else
		{		
			console.log(bids.affectedRows);

			if(bids.affectedRows > 0)
			{
				res.send({result : "true"});
			}
			else
			{
				res.send({result : "false"});
			}

		}
	},postBidQuery);	
}


exports.getBidHistory = function(req,res){
	console.log("In BidHistory");
	var auctionId = req.param("auctionId");
	var desc = req.param("desc");
	
	if(auctionId != null)
	{
		getBidInfo(function(error,results){
			if(error)
			{
				console.log("error occured while fetching bidding information");
				throw error;
				callback(error); 
			}
			else
			{	/*console.log("***************final Results************");
				console.log(results);
				console.log(results.bids);
				console.log(results.auction);
				*/
				
				
				totalBids = results.bids.length;
				var result = [_.countBy(results.bids, 'bidBy')];					
				totalUsers = result.length;				
				var startingPrice = results.auction[0].basePrice;
				
				
				var dateEnds = results.auction[0].dateEnds;
				var dateStarts = results.auction[0].datePlaced;
				
				
				var datePlaced = results.auction[0].datePlaced;
				
				Number.prototype.padLeft = function(base,chr)
				{
					var  len = (String(base || 10).length - String(this).length)+1;
					return len > 0? new Array(len).join(chr || '0')+this : this;
				}
				
				datePlaced = [datePlaced.getFullYear(),(datePlaced.getMonth()+1).padLeft(),
				              datePlaced.getDate().padLeft()
				                ].join('/') +' ' +
				                [datePlaced.getHours().padLeft(),
				                 datePlaced.getMinutes().padLeft(),
				                 datePlaced.getSeconds().padLeft()].join(':');
				
				
				res.render("bidHistory", { totalBids : totalBids , totalUsers : totalUsers , bids : results.bids,
					datePlaced : datePlaced , dateEnds:dateEnds , datePut : dateStarts, startingPrice : startingPrice , currentBid : results.bids[0].bidPrice,
					productId : results.auction[0].productId , desc : desc, auctionId : results.auction[0].auctionId
				});
									
			}
		},auctionId);	
		
	}
}
exports.getBidInfo=getBidInfo;

function getBidInfo (callback,auctionId)
{

	console.log("auction ID from getBidInfo" +auctionId);
	var getBidInfo = "SELECT b.bidId,b.auctionId,b.bidPrice ,b.date,b.bidBy,p.firstName" +
			" as userName FROM ebay.bidInfo b  INNER JOIN" +
			
			" ebay.person p ON b.bidBy = p.userId where b.auctionId = '"+auctionId+"' ORDER BY Date(date) desc,Time(date) desc";
	var getAuction = "select * from auction where auctionId = '"+auctionId+"'";

	mysql.fetchData(function(error,bids){

		if(error)
		{
			console.log("error occured while fetching bidding information");
			throw error;
			callback(error); 
		}
		else
		{	

			//console.log(bids);
			mysql.fetchData(function(error,auction){
				//console.log(auction);
				if(error)
				{
					console.log("error occured while fetching bidding information");
					throw error;
					callback(error); 
				}
				else
				{	
					//console.log("In return part of the called function");				
					callback(error,{bids : bids, auction: auction});					
				}
			},getAuction);				
		}
	},getBidInfo);	

}

exports.refreshBids = function(req,res){

	
	var auctionId = req.param("auctionId");
	
	
	
	getBidInfo(function(error,results){
		if(error)
		{
			console.log("error occured while fetching bidding information");
			throw error;
			res.send({result : "false"});
		}
		else
		{	
			console.log("IN the refresh bids");
			totalBids = results.bids.length;
			var result = [_.countBy(results.bids, 'bidBy')];					
			totalUsers = result.length;				
			var startingPrice = results.auction[0].basePrice;
			var datePlaced = results.auction[0].datePlaced;
			
			Number.prototype.padLeft = function(base,chr)
			{
				var  len = (String(base || 10).length - String(this).length)+1;
				return len > 0? new Array(len).join(chr || '0')+this : this;
			}
			
			datePlaced = [datePlaced.getFullYear(),(datePlaced.getMonth()+1).padLeft(),
			              datePlaced.getDate().padLeft()
			                ].join('/') +' ' +
			                [datePlaced.getHours().padLeft(),
			                 datePlaced.getMinutes().padLeft(),
			                 datePlaced.getSeconds().padLeft()].join(':');
			
			
			res.send({results:"true" , totalBids : totalBids , totalUsers : totalUsers , bids : results.bids,
				datePlaced : datePlaced , startingPrice : startingPrice , currentBid : results.bids[0].bidPrice,
				productId : results.auction[0].productId
			});
								
		}
	},auctionId);	
	
}

