var async = require('async');
var Q = require('q');
/*npm install hacker-news-api*/
var hn = require('hacker-news-api');
/*npm install sentiment*/
var sentiment = require('sentiment');


var search = function(repoName) {
  console.log('Searching HackerNews...');

  var deferred = Q.defer();

  async.parallel({
    comments_since_past_month: function(callback) {
      var comments = [];

      // Search for comments containing repoName since past month
      hn.comment().search(repoName).since('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          var sentiment_score = sentiment(data.hits[i].comment_text);

          comments.push({
            date: data.hits[i].created_at.split("T")[0],
            score: sentiment_score.score
          });
        }
        callback(null, comments);
      });
    },
    comments_before_past_month: function(callback) {
      var comments = [];

      // Search for comments containing repoName after past month
      hn.comment().search(repoName).before('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          var sentiment_score = sentiment(data.hits[i].comment_text);

          comments.push({
            date: data.hits[i].created_at.split("T")[0],
            score: sentiment_score.score
          });
        }
        callback(null, comments);
      });

    },
    stories_since_past_month: function(callback) {
      var stories = [];
      
      // Search for storys containing repoName since past month
      hn.story().search(repoName).since('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          var sentiment_score;

          if (data.hits[i]._highlightResult.story_text == null || data.hits[i]._highlightResult.story_text.value == "") {
            sentiment_score = sentiment(data.hits[i]._highlightResult.title.value);
          } else {
            sentiment_score = sentiment(data.hits[i]._highlightResult.story_text.value);
          }

          stories.push({
            date: data.hits[i].created_at.split("T")[0],
            score: sentiment_score.score
          });
        }
        callback(null, stories);
      });

    },
    stories_before_past_month: function(callback) {
      var stories = [];

      // Search for storys containing repoName after past month
      hn.story().search(repoName).before('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          var sentiment_score;

          if (data.hits[i]._highlightResult.story_text == null || data.hits[i]._highlightResult.story_text.value == "") {
            sentiment_score = sentiment(data.hits[i]._highlightResult.title.value);
          } else {
            sentiment_score = sentiment(data.hits[i]._highlightResult.story_text.value);
          }

          stories.push({
            date: data.hits[i].created_at.split("T")[0],
            score: sentiment_score.score
          });
        }
        callback(null, stories);
      });
    }
  }, function(err, results) {
    console.log('finished!');

    var returned = [];
    var array = [results.comments_since_past_month, 
                 results.comments_before_past_month,
                 results.stories_since_past_month,
                 results.stories_before_past_month];

    for (var i = 0; i < array.length; i++) {
      returned = returned.concat(array[i]);
    }    

    deferred.resolve(returned);
  });

  return deferred.promise;
}

module.exports = {
	search: search
}
