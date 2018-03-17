/**
 * New node file
 */
var mysql=require('./mysql');

exports.getAllSellerDataForAdmin=function(req,res)
{
	var sql="select s.sellerId,p.firstname,s.membershipid,s.avgReview,s.reviewCount from seller s,person p where s.personid=p.userid";
	
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