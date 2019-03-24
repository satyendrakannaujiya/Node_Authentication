
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;
const passport = require('passport');
const nocache = require('nocache')


//passprt config

require('./config/passport')(passport);



//No Cache

app.use(nocache());


//EJS

app.use(expressLayouts);
app.set('view engine','ejs');
//body parser
app.use(express.urlencoded({ extended : false}));

//Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))


//Paasport misddleware
app.use(passport.initialize());
app.use(passport.session());

// /connect flasj

app.use(flash());

//Gloabal vars
app.use((req,res,next)=>{

         res.locals.success_msg = req.flash('success_msg');
         res.locals.error_msg = req.flash('error_msg');
         res.locals.error = req.flash('error');
         next();
})


//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


app.listen(PORT,console.log(`Sertever started on port ${PORT}`))
