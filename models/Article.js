// ----------------------------------------------------------------------------------------------------------------------------
// Node Dependencies
// ----------------------------------------------------------------------------------------------------------------------------
var moment = require("moment");
var mongoose = require('mongoose');

// ----------------------------------------------------------------------------------------------------------------------------
// Create Schema
// ----------------------------------------------------------------------------------------------------------------------------
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  updated: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm A')
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

// ----------------------------------------------------------------------------------------------------------------------------
// Article Model
// ----------------------------------------------------------------------------------------------------------------------------
var Article = mongoose.model('Article', ArticleSchema);


module.exports = Article;
