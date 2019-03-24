
const LocalStrategy = require('passport-local').Strategy;
const user_db_operation = require('../db_operation/user_operation');
const mysql = require('mysql');

const bcrypt = require('bcryptjs');

module.exports = function(passport){
	  passport.use(
            new LocalStrategy({usernameField : 'email'}, (email,password,done)=>{

            	//Match user

            	user_db_operation.isUserExist(email,function(result){

            		if(Object.keys(result).length>0){
                          //Match user email now match pasword

                       user_db_operation.getPassword(email,function(pass){


                                     pass = Object.values(pass[0]);
                                     pass=pass[0];
                                    
                       	     bcrypt.compare(password,pass,(err,isMatch)=>{

                       	     	if (err) throw err;
                       	     	if(isMatch){

                       	     		user_db_operation.getUserDetails(email,function(result){


                       	     		    return done(null,result[0]);
                       	     		})
                       	     		  
                       	     	}else{
                       	     		  return done(null,false,{message:"Password is incorrect"});
                       	     	}

                       	     });

                       })
                         
                          

            		}
            		else{

            			  return done(null,false,{message : "That email is not registered"});;
            		}

            	})

            })
	  	);


	      passport.serializeUser(function(user, done) {
               done(null, user.id);
             });

           passport.deserializeUser(function(id, done) {
           

           user_db_operation.getUserById(id,function(result){

                       done(null,result[0]);
           });
       });

}
