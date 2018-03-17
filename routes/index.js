var ejs = require("ejs");
var mysql = require('./mysql');

var express = require('express');


exports.index = function(req, res){
	
	var sqlCategories="select * from category";
	mysql.fetchData(function(error,results){
		
		if(error)
			{
			console.log("error occured");
				throw error;
			}
		else
			{
			if(results.length>0)
				
				{
				console.log("data got");
				console.log(JSON.stringify(results));
				res.render('admin',{categories:results});
				}
		
			
			}
	},sqlCategories);
	
};

exports.redirect=function(req,res)
{
	res.render('test');

}
