var async = require('async');
var Q = require('q');
var Snoocore = require('snoocore');
var sentiment = require('sentiment');

var reddit = new Snoocore({
  userAgent: 'Seng371Project2@0.0.1 by guand'
  // Other configuration options here. See the configuration
  // section for more information on these
});

var search = function(repoName) {
	var deferred = Q.defer();

  var redditLinks = [];

  var nextPage;
  var maxNumLinks = 1000;
  var currentNumLinks = 0;

  async.doWhilst(
    function(callback) {
      reddit('/search').get({
          q: repoName, 
          limit: 100,
          after: nextPage
        }).then(function(result) {
          currentNumLinks += result.data.children.length;
          redditLinks = redditLinks.concat(result.data.children);
          nextPage = result.data.after;
          callback();
      });
    }, function() {
      return currentNumLinks < maxNumLinks && typeof nextPage != null;
    }, function(err) {
      if (err) throw err;

      var returned = [];
      for (var i = 0; i < redditLinks.length; i++) {
        returned.push({
          date: redditLinks[i].data.created_utc,
          score: sentiment(redditLinks[i].data.selftext).score,
          text: redditLinks[i].data.selftext
        });
      }
      deferred.resolve(returned);
  });

	return deferred.promise;
}

/* What is this doing? */
var searchComments = function(req, res) {
	var deferred = Q.defer();

	reddit('/comments/2to2a6').get().then(function(result) {
		deferred.resolve(result);
	}).done();

	return deferred.promise;
}

module.exports = {
	search: search,
	searchComments: searchComments
}
