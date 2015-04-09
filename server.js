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
    result.render('index', 
        {title: 'SENG371 Project #2 - Sentimental Analysis with GitHub Activities'}
    );
});

router.get('/repo', function(request, result) {
    result.render('index', 
        {title: 'SENG371 Project #2 - Sentimental Analysis with GitHub Activities'}
    );

    var currentRepo = request.query.repoName;
    var repoFileName = currentRepo + '.json';
    var gitHubData, redditData, hackerNewsData;
    
    hackerNews.search(currentRepo).then(function (response) {
      fs.writeFile('data/' + repoFileName, JSON.stringify(response, null, 2), function(err) {
        if (err) {
          console.log('Could not write to file: ' + repoFileName);
        }

        console.log('Wrote to file: ' + repoFileName);
      })
    });

//    Q.all([gitHub.getData(currentRepo),
//            reddit.search(currentRepo),
//            hackerNews.search(currentRepo)])
//        .spread(function(gitHubData, redditData, hackerNewsData) {
// 
//        })
});

router.get('/data', function(request, result) {
  var currentRepo = request.query.repoName;

  console.log('looking');
  console.log(currentRepo);

  fs.readFile('data/' + repoFileName, function(err, data) {
    if (err) {
      console.log(err);
      result.send('Could not find such a file: data/' + repoFileName);
    } else {
      result.send(data);
    }
  });

});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/', router);
app.listen(port);

console.log('Listening on port: ' + port);
