// ----------------------------------------------------------------------------------------------------------------------------
// Node Dependencies
// ----------------------------------------------------------------------------------------------------------------------------
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require("morgan"); // for debugging
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping
var axios = require("axios"); // for web-scraping
var exphbs = require('express-handlebars');

// ----------------------------------------------------------------------------------------------------------------------------
// Import models
// ----------------------------------------------------------------------------------------------------------------------------
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

// ----------------------------------------------------------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------------------------------------------------------

// Index Page (first visit to the site - need to scrape articles)
router.get('/', function (req, res) {
  res.redirect('/scrape');
});


// Articles Page
router.get('/articles', function (req, res) {
  Article.find().sort({_id: -1}).populate('comments').exec(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      var hbsObject = {articles: doc}
      res.render('index', hbsObject);
    }
    // This Queries MongoDB for all articles and sorts from newest to top (assuming Ids increment)
    // It then populates any user comments associated with the articles.
    });

});

// Web Scrape Route
router.get('/scrape', function(req, res) {
  // First, grab the body of the html with request

  axios.get("http://www.rotoworld.com/playernews/nba/").then(function(res) {

  var $ = cheerio.load(res.data);
    // Now, grab every everything with a class of "inner" with each "article" tag
    $('.pb').each(function(i, element) {
      // var result = {}
      var player = $(this).children(".headline")
                           .children(".player")
                           .children("a")
                           .first()
                           .text()
      // console.log(player)

      var team = $(this).children(".headline")
                           .children(".player")
                           .children("a")
                           .last()
                           .text()
      // console.log(team)
      for (let i = 0; i<15; i++) {
      var report = $(this).children("#cp1_ctl00_rptBlurbs_floatingcontainer_" + i)
                             .children(".report")
                             .children("p")
                             .text();
      // console.log(report)
      var impact = $(this).children("#cp1_ctl00_rptBlurbs_floatingcontainer_" + i)
                             .children(".impact")
                             .text();
      // console.log(impact)
      }
    });
    // Redirect to the Articles Page, done at the end of the request for proper scoping

  });
  res.redirect("/articles");
});


// Add a Comment Route - **API**
router.post('/add/comment/:id', function (req, res){

  // Collect article id
  var articleId = req.params.id;

  // Collect Author Name
  var commentAuthor = req.body.name;

  // Collect Comment Content
  var commentContent = req.body.comment;

  // "result" object has the exact same key-value pairs of the "Comment" model
  var result = {
    author: commentAuthor,
    content: commentContent
  };

  // Using the Comment model, create a new comment entry
  var entry = new Comment (result);

  // Save the entry to the database
  entry.save(function(err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    }
    // Or, relate the comment to the article
    else {
      // Push the new Comment to the list of comments in the article
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':doc._id}}, {new: true})
      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          // Send Success Header
          res.sendStatus(200);
        }
      });
    }
  });

});




// Delete a Comment Route
router.post('/remove/comment/:id', function (req, res){

  // Collect comment id
  var commentId = req.params.id;

  // Find and Delete the Comment using the Id
  Comment.findByIdAndRemove(commentId, function (err, todo) {

    if (err) {
      console.log(err);
    }
    else {
      // Send Success Header
      res.sendStatus(200);
    }

  });

});

module.exports = router;
