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
  player: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  report: {
    type: String,
    required: true
  },
  impact: {
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
