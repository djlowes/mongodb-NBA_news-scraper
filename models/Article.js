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
    required: false,
    trim: true
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

// Validator for 'report' (solved by adding 'trim')
ArticleSchema.path('report').validate(function (value) {
    // a func returns boolean, but actually not executed in this case
}, 'Title is not valid')

// ----------------------------------------------------------------------------------------------------------------------------
// Article Model
// ----------------------------------------------------------------------------------------------------------------------------
var Article = mongoose.model('Article', ArticleSchema);


module.exports = Article;
