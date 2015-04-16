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
});

// Return the data source that the client is asking for e.g. dataSource=reddit.
router.get('/data/:repoName/:dataSource?', function(request, result) {
  var repoName = request.params.repoName;
  var dataSource = request.params.dataSource;

  var hackerNewsFileName = request.params.repoName + '-hackernews.json';
  var redditFileName = request.params.repoName + '-reddit.json';
  var gitHubFileName = request.params.repoName + '-github.json';

  var dataSourcesToRetrieve = {};
  if (dataSource == null) {
    dataSourcesToRetrieve.reddit = true;
    dataSourcesToRetrieve.hackerNews = true;
    dataSourcesToRetrieve.gitHub = true;
  } else {
    dataSourcesToRetrieve[dataSource] = true;
  }

  // If files don't exist, hit the APIs and create the files. 
  async.parallel({
    redditData: function(callback) {
      console.log("Obtaining Reddit data...");

      if (dataSourcesToRetrieve.reddit != 'undefined') {
        fs.readFile('data/' + redditFileName, function(error, fd) {
          if (error) {
            // File doesn't exist already. Query the API and save to a file.
            console.log("Reddit file does NOT already exist.");
            reddit.search(repoName).then(function (result) {
              fs.writeFile('data/' + redditFileName, JSON.stringify(result, null, 2), function(err) {
                if (err) {
                  return console.log("Could not write to " + redditFileName + ".");
                }
                console.log("Reddit file successfully saved.");
                callback(null, result);
              });
            });
          } else {
            console.log("Reddit file already exists.");
            callback(null, JSON.parse(fd));
          }
        });
      }
    },
    hackerNewsData: function(callback) {
      console.log("Obtaining HackerNews data...");
      if (dataSourcesToRetrieve.hackerNews != 'undefined') {
        fs.readFile('data/' + hackerNewsFileName, function(error, fd) {
          if (error) {
            // File doesn't exist.
            console.log("HackerNews file does NOT already exist.");
            hackerNews.search(repoName).then(function (result) {
              console.log("Result from HackerNews");

              fs.writeFile('data/' + hackerNewsFileName, JSON.stringify(result, null, 2), function(err) {
                if (err) {
                  return console.log("Could not write to " + hackerNewsFileName + ".");
                }
                console.log("HackerNews file successfully saved.");
                callback(null, result);
              });
            });
          } else {
            console.log("HackerNews file already exists.");
            callback(null, JSON.parse(fd));
          }
        });
      }
    },
    gitHubData: function(callback) {
      console.log("Obtaining GitHub data...");
      callback(null, {});
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
app.use('/', router);
app.listen(port);

console.log('Listening on port: ' + port);

