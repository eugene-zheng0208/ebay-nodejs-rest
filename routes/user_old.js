
/*
 * GET users listing.
 */
var mysql=require('./mysql');
exports.list = function(req, res){
	res.send("respond with a resource");
};

exports.getUserInfo = function(req,res){	


	var userId = req.param("userId");

		
	
	var getUserDetails = "SELECT p.firstName,p.lastName,p.registrationDate,s.avgReview FROM ebay.person p  " +
			"INNER JOIN ebay.seller s  ON p.userId = s.personId where p.userId = '"+userId+"'";


	mysql.fetchData(function(err2,user){
		if(err2){
			console.log("error occured while getting user details");
			throw err2;
			res.send({result : "false"});
		}
		else {	
			getReviews(function(error,reviews){
				if(error){
					console.log("error occured while getting user details");
					throw error;
					res.send({result : "false"});
				}
				else {	
					console.log("from my results");
					console.log(reviews);

					var reviewCount = reviews.reviews.length;

					var latestFive = [] ;
					var i = 0;
					while (i < 5 && i < reviews.reviews.length)
					{						
						latestFive[i] = (reviews.reviews[i]);
						i++;
					}		
					
					var d = user[0].registrationDate;
					
					Number.prototype.padLeft = function(base,chr)
					{
						var  len = (String(base || 10).length - String(this).length)+1;
						return len > 0? new Array(len).join(chr || '0')+this : this;
					}
					

					var regDate = [d.getFullYear(),(d.getMonth()+1).padLeft(),
					               d.getDate().padLeft()
					               ].join('/') ;


					
					
					var name = user[0].firstName +" "+ user[0].lastName;
					var avgReview = user[0].avgReview;
					
					
					

					res.render("userdetails", {regDate:regDate, name : name , avgReview : avgReview , reviews : reviews.reviews , sellerId : userId , reviewCount : reviewCount , latestReviews : latestFive});
				}
			},userId);	
			
		}
	},getUserDetails);
	
	
	
}


exports.refreshReviews = function(req,res)
{

	var userId = req.param("userId");	

	console.log("user id from the request" + userId);

	getReviews(function(error,reviews){
		if(error){
			console.log("error occured while posting seller review");
			throw error;
			res.send({result : "false"});
		}
		else {	
			console.log(reviews.reviews);
			var latestFive = [] ;
			var i = 0;
			console.log(reviews.reviews.length);
			while (i < 5 && i < reviews.reviews.length)
			{				
				
				latestFive[i] = (reviews.reviews[i]);
				i++;
			}	
			console.log(latestFive);
			res.send({results : "true" , reviews : reviews.reviews , latestReviews : latestFive});
		}
	},userId);	


}


function getReviews (callback,sellerId)
{
	
	
	
	var getSellerId = "select sellerId from seller where personId = '"+sellerId+"'";
	
	
	mysql.fetchData(function(err2,seller){
		if(err2){
			console.log("error occured while getting seller review");
			throw err2;
			callback(err2); 
		}
		else {	
			
			/*var getReviews = "SELECT s.text,s.rating,s.modifiedDate,s.reviewedBy,p.firstName as userName FROM ebay.sellerreview s " +
			"INNER JOIN ebay.customer c   ON s.reviewedBy = c.customerId INNER JOIN" +
			" ebay.person p ON c.personId = p.userId where s.reviewedFor = '"+seller[0].sellerId+"' ORDER BY Date(s.modifiedDate) desc,Time(s.modifiedDate) desc";
			*/
			var sellerid=seller[0].sellerId;
			var getReviews="SELECT s.text,s.rating,s.modifiedDate,s.reviewedBy,p.firstName as userName FROM ebay.sellerreview s INNER JOIN ebay.person p ON s.reviewedBy = p.userId where s.reviewedFor = '"+sellerid+"'";
			
			mysql.fetchData(function(err2,reviews){
				if(err2){
					console.log("error occured while getting seller review");
					throw err2;
					callback(err2); 
				}
				else {	

					callback( err2 , {reviews : reviews});
				}
			},getReviews);
		}
	},getSellerId);
	
}



exports.postSellerReview = function(req,res){

	var sellerid = req.session.sellerid;
	var review = req.body.review;
	var rating  = req.body.rating;
	//var user = req.session.loggedInUser;

	Number.prototype.padLeft = function(base,chr)
	{
		var  len = (String(base || 10).length - String(this).length)+1;
		return len > 0? new Array(len).join(chr || '0')+this : this;
	}
	var d = new Date();

	var dformat = [d.getFullYear(),(d.getMonth()+1).padLeft(),
	               d.getDate().padLeft()
	               ].join('/') +' ' +
	               [d.getHours().padLeft(),
	                d.getMinutes().padLeft(),
	                d.getSeconds().padLeft()].join(':');


	var reviewedDate = dformat;
	var modifiedDate = dformat;

//	var userId = req.param("userId");

	var userid=req.session.userid;
	//Order by user
	// take those order ids and check that user took any thing from seller?


	var ifReviewed = "SELECT * FROM `sellerreview` WHERE reviewedBy= '"+userid+"' and reviewedFor =  '"+sellerid+"'";



	mysql.fetchData(function(error,results){

		if(error)
		{
			console.log("error occured while posting seller review");
			throw error;
			res.send({result : "false"});
		}
		else
		{				

			if(results.length == 0)
			{

				var checkPurchase = "SELECT o.orderId,o.soldBy,p.datePlaced,p.orderedBy" +
				" FROM ebay.orderitem o  INNER JOIN ebay.order p " +
				" ON o.orderId = p.orderId where p.orderedBy = '"+userid+"' and o.soldBy='"+sellerid+"'";

				
				mysql.fetchData(function(error,results){

					if(error)
					{
						console.log("error occured while posting seller review");
						throw error;
						res.send({result : "false"});
					}
					else
					{				

						//if(results.length > 0)
						//{

							var postReviewQuery = "INSERT INTO sellerreview (text,rating,reviewedBy,reviewedFor,reviewedDate, modifiedDate) VALUES ('"+review+"','"+ rating+"','"+userid+"','"+ sellerid+"', '"+reviewedDate +"','"+modifiedDate +"')";


							mysql.fetchData(function(err2,result1){
								if(err2){
									console.log("error occured while posting seller review");
									throw error;
									res.send({result : "false"});
								}
								else {	

									res.send({result : "true"})

								}
							},postReviewQuery);	

						//}
						//else
						//{
							//res.send({result : "false" , message : "You did not purchase anything from this seller!!"});
						//}
					}
				},checkPurchase);	
			}
			else
			{
				res.send({result : "false" , message : "You have already posted review for this seller!!"});
			}
		}
	},ifReviewed);
}