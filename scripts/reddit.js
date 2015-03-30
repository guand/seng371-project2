var Snoocore = require('snoocore');


var reddit = new Snoocore({
  userAgent: 'Seng371Project2@0.0.1 by guand'
  // Other configuration options here. See the configuration
  // section for more information on these
});



var redditScript = function(req, res) {
	reddit('/search').get({q: 'bootstrap'}).then(function(result) {
		res.send(result);
	}).done();
}

var redditTest = function(req, res) {
	reddit('/comments/2to2a6').get().then(function(result) {
		res.send(result);
	}).done();
}

module.exports = {
	reddit: redditScript,
	test: redditTest
}