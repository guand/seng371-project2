var express = require('express');
var jade = require('jade');
var Q = require('q');
var d3 = require('d3');
var fs = require('fs');
var async = require('async');
var base = require('path');
var hackerNews = require('./scripts/hacker-news.js');
var reddit = require('./scripts/reddit');
var gitHub = require('./scripts/github.js');
var directory = require('./library/directory.js');
var path = __dirname + '/data';

var app = express();
var port = process.env.PORT || 9001;
var router = express.Router();

directory.init(path);

router.get('/', function(request, result) {
    result.render('index');
});

router.get('/repo', function(request, result) {
    result.render('index');
});

// Return the data source that the client is asking for e.g. dataSource=reddit.
router.get('/data/:repoName/:dataSource?', function(request, result) {
  // If files don't exist, hit the APIs and create the files. 
  async.parallel({
    redditData: function(callback) {
      console.log("Obtaining Reddit data...");
      directory.generateData(path, request, 'reddit', reddit.search, callback);
    },
    hackerNewsData: function(callback) {
      console.log("Obtaining HackerNews data...");
      directory.generateData(path, request, 'hackerNews', hackerNews.search, callback);
    },
    gitHubData: function(callback) {
      console.log("Obtaining GitHub data...");
      directory.generateData(path, request, 'gitHub', gitHub.search, callback);
    }
  }, function(err, results) {
    if (err) throw err;
    
    var returned = {};
    returned.reddit = results.redditData;
    returned.hackerNews = results.hackerNewsData;
    returned.gitHub = results.gitHubData;

    result.send(returned);
  });
});


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(base.join(__dirname, 'public')));
app.use('/', router);
app.listen(port);

console.log('Listening on port: ' + port);

