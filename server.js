var express = require('express');
var morgan = require('morgan');
var methodOverride = require('method-override');
var jade = require('jade');
var d3 = require('d3');
var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'SENG371-SentimentAnalysis@0.0.1 by seng371-sentimental'  
});

var app = express();
var port = process.env.PORT || 9001;
var router = express.Router();

router.get('/', function(request, result) {
	result.render('index', 
		{title: 'SENG371 Project #2 - Sentimental Analysis with GitHub Activities'}
	);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/', router);
app.listen(port);

console.log('Listening on port: ' + port);

