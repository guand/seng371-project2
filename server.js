var express = require('express');
var morgan = require('morgan');
var methodOverride = require('method-override');
var jade = require('jade');
var Q = require('q');
var d3 = require('d3');
// https://github.com/mbostock/d3/pull/2225#issuecomment-73426201
var jsdom = require('jsdom');
var hackerNews = require('./scripts/hacker-news.js');
var redditScript = require('./scripts/reddit');
var githubScripts = require('./scripts/github.js');

var app = express();
var port = process.env.PORT || 9001;
var router = express.Router();

router.get('/', function(request, result) {
    result.render('index', 
        {title: 'SENG371 Project #2 - Sentimental Analysis with GitHub Activities'}
    );

    var document = jsdom.jsdom();

    var svg = d3.select(document.body)
        .append('p')
        .text('hello worlawpoefwjefpoaj awpofjwaopiafwed!');

    d3.select(document.body)
        .append('svg:svg')
        .attr('width', 600).attr('height', 300)
        .append('circle')
        .attr('cx', 300).attr('cy', 150).attr('r', 30).attr('fill', '#26963c');

});

router.get('/repo', function(request, result) {
    result.render('index', 
        {title: 'SENG371 Project #2 - Sentimental Analysis with GitHub Activities'}
    );

    var currentRepo = request.query.repoName;
    githubScripts.getData(currentRepo);
});

app.get('/reddit/script', redditScript.reddit);
app.get('/reddit/test', redditScript.test);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/', router);
app.listen(port);

console.log('Listening on port: ' + port);

