var http = require('http');

/*npm install hacker-news-api*/
var hn = require('hacker-news-api');
/*npm install sentiment*/
var sentiment = require('sentiment');


var repoName = "Bootstrap";

http.createServer(function(request, response) {
	// response.writeHead(200, {"Content-Type": "application/json"});
	var commentScores = [];
	var storyScores = [];

	var commentsDate = [];
	var storysDate = [];

	// Search for comments containing repoName since past month
	hn.comment().search(repoName).since('past_month').top(function (error, data) {
	 
		if (error) throw error ;
		for (var i = 0; i < data.hits.length; i++) {
			commentsDate.push(JSON.stringify(data.hits[i].created_at.split("T")[0]));

			var r1 = sentiment(JSON.stringify(data.hits[i].comment_text));
			commentScores.push(JSON.stringify(r1.score));
		}
	});

	// Search for comments containing repoName after past month
	hn.comment().search(repoName).before('past_month').top(function (error, data) {
	 
		if (error) throw error ;
		for (var i = 0; i < data.hits.length; i++) {
			commentsDate.push(JSON.stringify(data.hits[i].created_at.split("T")[0]));

			var r1 = sentiment(JSON.stringify(data.hits[i].comment_text));
			commentScores.push(JSON.stringify(r1.score));
		}
	});

	// Search for storys containing repoName since past month
	hn.story().search(repoName).since('past_month').top(function (error, data) {
	 
		if (error) throw error ;
		for (var i = 0; i < data.hits.length; i++) {
			if (data.hits[i]._highlightResult.story_text == null || data.hits[i]._highlightResult.story_text.value == "") {
				var r1 = sentiment(JSON.stringify(data.hits[i]._highlightResult.title.value));
			}
			else {
				var r1 = sentiment(JSON.stringify(data.hits[i]._highlightResult.story_text.value));
			}
			storysDate.push(JSON.stringify(data.hits[i].created_at.split("T")[0]));

			storyScores.push(JSON.stringify(r1.score));
		}
	});

	// Search for storys containing repoName after past month
	hn.story().search(repoName).before('past_month').top(function (error, data) {
	 
		if (error) throw error ;
		for (var i = 0; i < data.hits.length; i++) {
			if (data.hits[i]._highlightResult.story_text == null || data.hits[i]._highlightResult.story_text.value == "") {
				var r1 = sentiment(JSON.stringify(data.hits[i]._highlightResult.title.value));
			}
			else {
				var r1 = sentiment(JSON.stringify(data.hits[i]._highlightResult.story_text.value));
			}
			storysDate.push(JSON.stringify(data.hits[i].created_at.split("T")[0]));
			
			storyScores.push(JSON.stringify(r1.score));
		}
	});
	// response.end();
}).listen(8888);
