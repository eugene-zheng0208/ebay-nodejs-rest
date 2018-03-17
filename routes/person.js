/**
 * New node file
 */
var mysql=require('./mysql');

exports.getAllPersonData=function(req,res)
{
var sql="select userid,firstname,lastname,email,country,lastlogin,isactive from person";
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
exports.updateUserStatus=function(req,res)
{
var userid=req.param("userid");
var status=req.param("status");
var sql="update person set isactive="+status+" where userid="+userid;
mysql.fetchData(function(error,result){
	
	if(error)
		throw error;
	else
		{
		if(result!=null)
			{
			
			console.log("user enabled");
			}
		}
	
},sql);

}