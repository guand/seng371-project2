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

  function asyncTask(dataSource, dataRetrieveFunction, callback) {
    var fileName = repoName + '-' + dataSource + '.json';

    if (dataSourcesToRetrieve[dataSource] != 'undefined') {
      fs.readFile('data/' + fileName, function(error, content) {
        if (error) {
          console.log(error);
          // File doesn't exist already. Query the API and save to a file.
          dataRetrieveFunction(repoName).then(function (result) {
            fs.writeFile('data/' + fileName, JSON.stringify(result, null, 2), function(error) {
              if (error) {
                console.log(error);
                return console.log("Could not write to " + fileName + ".");
              }

              console.log(fileName + " successfully saved.");
              callback(null, result);
            });
          });
        } else {
          console.log(fileName + " already exists.");
          callback(null, JSON.parse(content));
        }
      });
    }
  };

  // If files don't exist, hit the APIs and create the files. 
  async.parallel({
    redditData: function(callback) {
      console.log("Obtaining Reddit data...");
      asyncTask('reddit', reddit.search, callback);
    },
    hackerNewsData: function(callback) {
      console.log("Obtaining HackerNews data...");
      asyncTask('hackerNews', hackerNews.search, callback);
    },
    gitHubData: function(callback) {
      console.log("Obtaining GitHub data...");
      asyncTask('gitHub', gitHub.search, callback);
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

