var GitHubAPI = require('github');

// Object to URL query string
var QS = require('qs');
// Promises
var Q = require('q');
// Underscore.js
var _ = require('lodash');
var async = require('async');

var github = new GitHubAPI({
	version: "3.0.0",
	debug: true,
	protocol: "https",
	timeout: 5000,
	headers: {
		"user-agent": "SENG371-SentimentAnalysis"
	}
});

github.authenticate({
    type: "oauth",
    token: 'c43b70e87678d01e1906699c7324b9816db81e83',
});

var currentUser, currentRepo, pullRequests, issues, stars, commits, contributors;

function getCurrentUser() {
	return currentUser;
}

function getCurrentRepo() {
	return currentRepo;
}

function getRepoUser(repoName) {
	var deferred = Q.defer();

	github.search.repos({
		"q": repoName
	}, function(error, result) {
		currentRepo = result.items[0];
		deferred.resolve(currentRepo.owner.login);
	});

	return deferred.promise;
}

function getData(repoName) {
	var deferred = Q.defer();

	getRepoUser(repoName)
		.then(function (repoUser) {
			Q.all([getNumPRs(repoUser, repoName),
					getNumIssues(repoUser, repoName)])
				.spread(function (pullRequests, numIssues) {
					var returned = {};
					returned.pullRequests = pullRequests;
					returned.numIssues = numIssues;

					deferred.resolve(returned);
				});
		});

	return deferred.promise;
}

function getNumPRs(ownerName, repoName) {
	var deferred = Q.defer();
	var pullRequestsAdded = false;
	var page = 1;
	pullRequests = [];

	console.log('Getting PRs');

	async.doWhilst(function (callback) {
		pullRequestsAdded = false;
		github.pullRequests.getAll({
			user: ownerName,
			repo: repoName,
			state: "closed", 
			per_page: 100,
			page: page
		}, function(error, result) {
			pullRequests = pullRequests.concat(_.filter(result, function(pr) {
				return pr.merged_at !== null;
			}));

			if (result.meta.link !== undefined && result.meta.link.indexOf('rel="next"') !== -1) {
				pullRequestsAdded = true;
				page += 1;
			}
			callback();
		});
	}, function () {
		return pullRequestsAdded;
	}, function (err) {
		deferred.resolve(pullRequests);
	});

	return deferred.promise;
}

function getNumIssues(ownerName, repoName) {
	var deferred = Q.defer();
	var issuesAdded = false;
	var page = 1;
	issues = [];

	console.log('Getting Issues');

	async.doWhilst(function (callback) {
		issuesAdded = false;
		github.issues.repoIssues({
			user: ownerName,
			repo: repoName,
			state: "all",
			assignee: "*",
			per_page: 100,
			page: page
		}, function(error, result) {
			issues = issues.concat(result);

			if (result.meta.link !== undefined && result.meta.link.indexOf('rel="next"') !== -1) {
				issuesAdded = true;
				page += 1;
			}

			callback();
		});
	}, function () {
		return issuesAdded;
	}, function (err) {
		deferred.resolve(issues);
	});

	return deferred.promise;
}

module.exports = {
	getCurrentRepo : getCurrentRepo,
	getRepoUser : getRepoUser,
	getData : getData,
	getNumPRs : getNumPRs,
	getNumIssues : getNumIssues,
}
