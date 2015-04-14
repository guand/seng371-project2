var express = require('express');
var jade = require('jade');
var Q = require('q');
var d3 = require('d3');
var fs = require("fs");
var async = require("async");
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

// Return the data source that the client is asking for e.g. dataSource=reddit.
router.get('/data/:repoName/:dataSource?', function(request, result) {
  var currentRepo = request.params.repoName;
  var dataSource = request.params.dataSource;

  // If files don't exist, hit the APIs and create the files. 
  if (!dataSource) {
    




  }




  // If dataSource is not set, return all data sources.
  if (!dataSource) {
    var returned = {};
    var error;

    async.parallel({
      hackerNews: function(callback) {
        var data = JSON.parse(fs.readFileSync('data/' + currentRepo + '-hackernews.json'));
        returned.hackerNews = data;
        callback(null, data);
      },
      reddit: function(callback) {
        var data = JSON.parse(fs.readFileSync('data/' + currentRepo + '-reddit.json'));
        returned.reddit = data;
        callback(null, data);
      }
    }, function(err, data) {
      if (err) throw err;
      //console.log(returned);
      result.send(returned);
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
