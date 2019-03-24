const mysql = require('mysql');
var connection = require('./connect');

connection.connect(function(err){
	  if(err){
	  	  console.err("Error in connecting "+err);
	  	  return ;
	  }

	  console.log('Connected as id ' + connection.threadId);
})




var isUserExist = function(email,callback){
	  connection.query(`select email from users where email='${email}'`,(err,res)=>{
	  	        if(err){
	  	        	  console.log("Error in isUserExit Query operation ");
	  	        }else{

                   callback(res);
	  	        }
	  })

}

var addUser = function(name,email,password,callback){
connection.query(`insert into users(name,email,password) values('${name}','${email}','${password}')`,(err,res)=>{


                   if(err){
                   	   console.log("Error in add user query ");
                   }
                   else{
                   	    callback("Success");
                   }
	          })
}

var getPassword = function(email,callback){
	 connection.query(`select password from users where email='${email}'`,(err,res)=>{
	 	  if(err){
	 	  	 console.log("error in GetPassword method ");
	 	  }
	 	  else{
	 	  	 callback(res);
	 	  }
	 })
}

var getUserDetails = function(email,callback){
	   connection.query(`select id,name,name from users where email='${email}'`,(err,res)=>{
	   	       if(err){
	   	       	  console.log("error in get userdetails");
	   	       }
	   	       else{
	   	       	callback(res);
	   	       }
	   })
}

var getUserById = function(id,callback){
	  connection.query(`select name,email from users where id=${id}`,(err,res)=>{
	  	      if(err){
	  	      	   console.log("Error in getUserById ");
	  	      }else{
	  	      	  callback(res);
	  	      }
	  })
}




module.exports = {

	isUserExist,
	addUser,
	getPassword,
	getUserDetails,
	getUserById
	
}
