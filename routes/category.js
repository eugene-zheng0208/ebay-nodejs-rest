/**
 * New node file
 */


/* create the restify server */




var mysql=require('./mysql');


exports.search=function(req,res)
{
	
var keyword=req.param("keyword");
console.log(keyword);
var sql="select name from ebay.subcategory where categoryid in (select c.categoryid from category c where  instr(NAME,'"+keyword+"') > 0)";

mysql.fetchData(function(error,resultsCat)
{
if(error)
	{
	throw error;
	}
else
	{
	if(resultsCat!=null)
		{
			res.send(resultsCat);
		}
	else
		{
		res.send("no results found");
		}
	}
}

,sql);





};

exports.listAllSubCategory=function(req,res)
{
	
var category=req.param("category");
var sql="select subcategoryid,name,description from subcategory where categoryid=(select categoryid from category where name='"+category+"')";
mysql.fetchData(function(error,results)
{
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

};
exports.updateSubcategoryDetails=function(req,res)
{
	
console.log("reached here");
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");

// req.params  == data on jquery ajax request.
var data = '';
req.addListener('data', function(chunk) { data += chunk; });
req.addListener('end', function() {
   var datagot = JSON.parse(data);
   console.log('data got');
   console.log(datagot.subcategoryid);
   var sql="update subcategory set name='"+datagot.name+"',description='"+datagot.description+"' where subcategoryid="+datagot.subcategoryid;
   mysql.fetchData(function(error,results)
		   {
	   			if(error)
	   				{
	   				throw error;
	   				}
	   			else
	   				{
	   			  res.writeHead(200, {'content-type': 'text/plain' });
	   		    res.send();
	   				}
		   },sql); 
});

}
exports.addNewSubcategory=function(req,res)
{
	var data = '';
	req.addListener('data', function(chunk) { data += chunk; });
	req.addListener('end', function() {
	   var datagot = JSON.parse(data);
	   console.log('data got');
	 
	   var category=req.param("category");
	   console.log(category);
	  // var sql="update subcategory set name='"+datagot.name+"',description='"+datagot.description+"' where subcategoryid="+datagot.subcategoryid;
	   var sql="select categoryid from category where name='"+category+"'";
	   mysql.fetchData(function(error,results){
		   if(results!=null)
			   {
			   var catid=results[0].categoryid;
			   console.log(catid);
			   var sql="insert into subcategory(categoryid,name,description) values("+catid+",'"+datagot.name+"','"+datagot.description+"')";
			   mysql.fetchData(function(error,results)
					   {
				   			if(error)
				   				{
				   				throw error;
				   				}
				   			else
				   				{
				   			  res.writeHead(200, {'content-type': 'text/plain' });
				   		    res.send();
				   				}
					   },sql); 
			   }
		   
	   },sql);
	  
	 
	});

}
function deleteSubcategory(req,res)
{
	console.log("in here in delete");
	var subcatid=req.param("subcategoryid");
	var sql="select * from product where subcategoryid="+subcatid;
	mysql.fetchData(function(error,results){
		
		if(error)
			{
			throw error;
			}
		else
			{
			if(results!=null && results.length>0)
				{
				console.log(results.length);
				res.send(results);
				}
			else
				{
				var sql="delete from subcategory where subcategoryid="+subcatid;
				mysql.fetchData(function(error,results){
					if(error)
						{
						console.log("error in deleting sub category");
						throw error;
						}
					else
						{
						if(results!=null)
							{
							console.log("category deleted successfull");
							}
						}
					
				},sql);
				}
			
			
			}
		
		
	},sql);
}

exports.deleteSubcategory=deleteSubcategory;