// ----------------------------------------------------------------------------------------------------------------------------
// Node Dependencies
// ----------------------------------------------------------------------------------------------------------------------------
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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


//MongoDB info required


// ----------------------------------------------------------------------------------------------------------------------------
// Sshhhh... Listen
// ----------------------------------------------------------------------------------------------------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});
