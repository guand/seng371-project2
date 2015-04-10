var express = require('express');
var jade = require('jade');
var Q = require('q');
var d3 = require('d3');
var fs = require("fs");
var hackerNews = require('./scripts/hacker-news.js');
var reddit = require('./scripts/reddit');
var gitHub = require('./scripts/github.js');

var app = express();
var port = process.env.PORT || 9001;
var router = express.Router();

router.get('/', function(request, result) {
    result.render('index');
});

router.get('/repo', function(request, result) {
    result.render('index');

    var currentRepo = request.query.repoName;
    var hackerNewsFileName = request.query.repoName + '-hackernews.json';
    var redditFileName = request.query.repoName + '-reddit.json';
    var gitHubFileName = request.query.repoName + '-github.json';

    var gitHubData, redditData, hackerNewsData;
    
    if (currentRepo.length == 0) {
      return;
    }

    // hackerNews.search(currentRepo).then(function (response) {
    //   fs.writeFile('data/' + hackerNewsFileName, JSON.stringify(response, null, 2), function(err) {
    //     if (err) {
    //       console.log('Could not write to file: ' + hackerNewsFileName);
    //     }

    //     console.log('Wrote to file: ' + hackerNewsFileName);
    //   })
    // });

//    Q.all([gitHub.getData(currentRepo),
//            reddit.search(currentRepo),
//            hackerNews.search(currentRepo)])
//        .spread(function(gitHubData, redditData, hackerNewsData) {
// 
//        })
});

router.get('/data/:repoName/:dataSource?', function(request, result) {
  var currentRepo = request.params.repoName;
  var dataSource = request.params.dataSource;

  // Return the data source that the client is asking for e.g. dataSource=reddit.

  // If dataSource is not set, return all data sources.
  if (!dataSource) {
    var returned = {};

    fs.readFile('data/' + currentRepo + '-hackernews.json', function(err, data) {
      if (err) {
        console.log(err);
        result.send('Could not find such a file: data/' + currentRepo);
      } else {
        results.hackernews = data;
      }
    });
  } else {
    fs.readFile('data/' + currentRepo + '-' + dataSource + '.json', function(err, data) {
      if (err) {
        console.log(err);
        result.send('Could not find such a file: data/' + currentRepo);
      } else {
        result.send(data);
      }
    });
  }

});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/', router);
app.listen(port);

console.log('Listening on port: ' + port);
