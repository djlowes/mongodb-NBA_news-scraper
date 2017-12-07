/*
// Created: Dec. 05, 2017 9:45 PM
// Author: David Lowes
*/

// ----------------------------------------------------------------------------------------------------------------------------
// Node Dependencies
// ----------------------------------------------------------------------------------------------------------------------------
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require("morgan"); // for debugging
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping

// ----------------------------------------------------------------------------------------------------------------------------
// Instantiate Express, allow body parsing & serve static content
// ----------------------------------------------------------------------------------------------------------------------------
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static(process.cwd() + '/public'));

// ----------------------------------------------------------------------------------------------------------------------------
// Use handlebars
// ----------------------------------------------------------------------------------------------------------------------------
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// ----------------------------------------------------------------------------------------------------------------------------
// MongoDB Environment
// ----------------------------------------------------------------------------------------------------------------------------
if (process.env.NODE_ENV == 'production') {
   mongoose.connect(/*insert here*/);
   } else {
  mongoose.connect('mongodb://localhost/mongodb-NBA_news-scraper');
   }

var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// ----------------------------------------------------------------------------------------------------------------------------
// Import models and reuire routing
// ----------------------------------------------------------------------------------------------------------------------------
var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');
var router = require('./controllers/controller.js');
app.use('/', router);

// ----------------------------------------------------------------------------------------------------------------------------
// Sshhhh... Listen
// ----------------------------------------------------------------------------------------------------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});
