const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var session=require('express-session');
var FileStore=require('session-file-store')(session);
var passport=require('passport');
var authenticate=require('./authenticate');
var config =require('./config');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const dishRouter  = require('./routes/dishRouter');
const leaderRouter= require('./routes/leaderRouter');
const promotionRouter=require('./routes/promotionRouter');
const uploadRouter=require('./routes/uploadRouter');
const favoriteRouter=require('./routes/favoriteRouter');

const mongoose =require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes=require('./models/dishes');
const Leaders=require('./models/leaders');
const Promotions=require('./models/promotions');
const Favorites=require('./models/favorites');

const url=config.mongoUrl;

const connect=mongoose.connect(url);


connect.then((db)=>{
	console.log("Connected correctly to server");
	},(err)=>{console.log(err);});





var app = express();

app.all('*',(req,res,next)=>{
	if(req.secure){
		return next();
	}
	else{
		res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
	}
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('1234-5678-9011'));



app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promotionRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favoriteRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
