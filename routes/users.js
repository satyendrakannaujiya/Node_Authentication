
const express = require('express');
const router = express.Router();
const user_db_operation = require('../db_operation/user_operation');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//LogionPage
router.get('/login',(req,res)=>{
      console.log("within user login get request ...");

      if(req.isAuthenticated()){

            res.redirect('/dashboard');
      }
	  res.render('login');
})

//Register
router.get('/register',(req,res)=>{
	  res.render('register');
})
//Registe handle
router.post('/register',(req,res)=>{

      var {name,email,password,password2 } = req.body;

      let errors = [];
      //Check required field

      if(!name || !email || !password || !password2){
      	  errors.push({msg : "Please fill in all the field"});

      }

      //Check password match

      if(password != password2){
      	errors.push({msg : "Password do not match"});

      }

      //Check length of password

      if(password.length < 6){
      	   errors.push({msg : "Password should be atleas 6 char length"});

      }

      if(errors.length > 0){

                res.render('register',{
                	  errors,
                	  name,
                	  email,
                	  password,
                	  password2
                });
      }else{

          //validation passed
         user_db_operation.isUserExist(email,function(result){
                
                if(Object.keys(result).length>0){
                  //user exist
                      errors.push({msg : "Email already registered "})
                    res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
                }
                else{
                   //hash pasword

                   bcrypt.genSalt(5,(err,salt)=>{
                       bcrypt.hash(password,salt,(err,hash)=>{
                                   if(err) throw err;
                                   password = hash;
                            console.log("hashed password " +password);

                           //Save the user
                            user_db_operation.addUser(name,email,password,function(status){
                                 console.log("response from db in adding " + status);
              req.flash('success_msg','You are now registered and can login');
                                 res.redirect('/users/login');
                            })
                            
                       })
                   })

                }
                
         })
             
      	


      }

});


//Login handle
router.post('/login',(req,res,next)=>{
    // console.log("within login post request ... ");
    // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

         passport.authenticate('local',{

              successRedirect: '/dashboard',
              failureRedirect: '/users/login',
              failureFlash: true
         })(req,res,next)
})


//Logout handle

router.get('/logout',(req,res)=>{
      req.logout();
      req.flash('success_msg','You are logged out');
      res.redirect('/users/login');
})
module.exports = router;