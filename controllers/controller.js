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
var fetch = require('node-fetch'); //async help

// ----------------------------------------------------------------------------------------------------------------------------
// Import models
// ----------------------------------------------------------------------------------------------------------------------------
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

// ----------------------------------------------------------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------------------------------------------------------

// Index Page (first visit to the site - need to scrape articles)
router.get('/', function(req, res) {
  res.redirect('/scrape');
});


// Articles Page
router.get('/articles', function(req, res) {
  Article.find().sort({
    _id: -1
  }).populate('comments').exec(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      var hbsObject = {
        articles: doc
      }
      res.render('index', hbsObject);
    }
    // This Queries MongoDB for all articles and sorts from newest to top (assuming Ids increment)
    // It then populates any user comments associated with the articles.
  });
});

// Web Scrape Route
router.get('/scrape', function(req, res) {
  // First, grab the body of the html with request
  var result = {}
  axios.get("http://www.rotoworld.com/playernews/nba/").then(function(res) {

    var $ = cheerio.load(res.data);
    // Now, grab every everything with a class of "inner" with each "article" tag
    $('.pb').each(function(i, element) {

        for (let i = 0; i < 15; i++) {
          result.report = $(this).children("#cp1_ctl00_rptBlurbs_floatingcontainer_" + i)
          .children(".report")
          .children("p")
          .text();
          result.impact = $(this).children("#cp1_ctl00_rptBlurbs_floatingcontainer_" + i)
          .children(".impact")
          .text();
          result.player = $(this).children(".headline")
          .children(".player")
          .children("a")
          .first()
          .text()
          result.team = $(this).children(".headline")
          .children(".player")
          .children("a")
          .last()
          .text()
        }
        //async issues need to be resolved here.
        article = new Article({
          player: result.player,
          team: result.team,
          report: result.report,
          impact: result.impact
        });

        article.save(function(err, resp) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated in the DB")
            console.log("RESPONSE" + resp)
          }
        });

    });

  });
  res.redirect("/articles");
});


// Add a Comment Route - **API**
router.post('/add/comment/:id', function(req, res) {

  var articleId = req.params.id;
  var commentAuthor = req.body.name;
  var commentContent = req.body.comment;

  var result = {
    author: commentAuthor,
    content: commentContent
  };

  var entry = new Comment(result);
  entry.save(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      Article.findOneAndUpdate({
          '_id': articleId
        }, {
          $push: {
            'comments': doc._id
          }
        }, {
          new: true
        })
        .exec(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            res.sendStatus(200);
          }
        });
    }
  });
});


router.post('/remove/comment/:id', function(req, res) {
  var commentId = req.params.id;
  Comment.findByIdAndRemove(commentId, function(err, todo) {

    if (err) {
      console.log(err);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
