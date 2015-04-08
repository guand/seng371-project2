var Q = require('q');
var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Seng371Project2@0.0.1 by guand'
  // Other configuration options here. See the configuration
  // section for more information on these
});

var search = function(repoName) {
	var deferred = Q.defer();

	reddit('/search').get({q: repoName}).then(function(result) {
		deferred.resolve(result);
	}).done();

	return deferred.promise;
}

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
