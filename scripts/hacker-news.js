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
      var comments = {};
      comments.dates = [];
      comments.scores = [];

      // Search for comments containing repoName since past month
      hn.comment().search(repoName).since('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          comments.dates.push(data.hits[i].created_at.split("T")[0]);

          var r1 = sentiment(data.hits[i].comment_text);
          comments.scores.push(r1.score);
        }
        callback(null, comments);
      });
    },
    comments_before_past_month: function(callback) {
      var comments = {};
      comments.dates = [];
      comments.scores = [];

      // Search for comments containing repoName after past month
      hn.comment().search(repoName).before('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          comments.dates.push(data.hits[i].created_at.split("T")[0]);

          var r1 = sentiment(data.hits[i].comment_text);
          comments.scores.push(r1.score);
        }
        callback(null, comments);
      });

    },
    stories_since_past_month: function(callback) {
      var stories = {};
      stories.dates = [];
      stories.scores = [];
      
      // Search for storys containing repoName since past month
      hn.story().search(repoName).since('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          if (data.hits[i]._highlightResult.story_text == null || data.hits[i]._highlightResult.story_text.value == "") {
            var r1 = sentiment(data.hits[i]._highlightResult.title.value);
          }
          else {
            var r1 = sentiment(data.hits[i]._highlightResult.story_text.value);
          }
          stories.dates.push(data.hits[i].created_at.split("T")[0]);
          stories.scores.push(r1.score);
        }
        callback(null, stories);
      });

    },
    stories_before_past_month: function(callback) {
      var stories = {};
      stories.dates = [];
      stories.scores = [];

      // Search for storys containing repoName after past month
      hn.story().search(repoName).before('past_month').top(function (error, data) {
        if (error) throw error;
        for (var i = 0; i < data.hits.length; i++) {
          if (data.hits[i]._highlightResult.story_text == null || data.hits[i]._highlightResult.story_text.value == "") {
            var r1 = sentiment(data.hits[i]._highlightResult.title.value);
          }
          else {
            var r1 = sentiment(data.hits[i]._highlightResult.story_text.value);
          }
          stories.dates.push(data.hits[i].created_at.split("T")[0]);
          stories.scores.push(r1.score);
        }
        callback(null, stories);
      });
    }
  }, function(err, results) {
    console.log('finished!');

    var dates = [];
    var scores = [];

    var array = [results.comments_since_past_month, 
                 results.comments_before_past_month,
                 results.stories_since_past_month,
                 results.stories_before_past_month];

    for (var i = 0; i < array.length; i++) {
      dates = dates.concat(array[i].dates);
      scores = scores.concat(array[i].scores);
    }    

    var returned = {dates: dates, scores: scores};

    deferred.resolve(returned);
  });

  return deferred.promise;
}

module.exports = {
	search: search
}
