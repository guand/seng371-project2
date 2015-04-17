var fs = require("fs");

/**
 * Creates the data directory on initialization of the server
 * @param  {[String]} path
 * @return {[type]}
 */
var init = function(path) {
    try {
        fs.lstat(path, function(err, stats){
            if(!err && stats.isDirectory()) {
                console.log("Directory already Exists!");
            } else {
                fs.mkdir(path, function(err) {
                    if(err) {
                    	console.log("What how did this happen!?!!: " + err);
                    }
                });
            }
        });
    } catch (e) {
        console.log("¯\_(ツ)_/¯ :" + e);
    }
}

/**
 * Generates the JSON files for the chosen repo which include Github, hackerNews, and Reddit
 * it will create the files if they do not exist, update the files if they are a day old, and
 * retrieve the files if they exist and are not old.
 * @param  {[String]} path
 * @param  {function} request
 * @param  {[String]} dataSource
 * @param  {Function} dataRetrieveFunction
 * @param  {callback} callback
 * @return {[type]}
 */
var generateData = function(path, request, dataSource, dataRetrieveFunction, callback) {
    var repoName = request.params.repoName;
    var dataSourcesToRetrieve = {};
    if (dataSource == null) {
        dataSourcesToRetrieve.reddit = true;
        dataSourcesToRetrieve.hackerNews = true;
        dataSourcesToRetrieve.gitHub = true;
    } else {
        dataSourcesToRetrieve[dataSource] = true;
    }

	var fileName = repoName + '-' + dataSource + '.json';
    var filePath = path + "/" + fileName;

    if (dataSourcesToRetrieve[dataSource] != 'undefined') {
        fs.stat(filePath, function(err, stats) {
            if(err) {
                dataRetrieveFunction(repoName).then(function(result) {
                    fs.writeFile(filePath, JSON.stringify(result, null, 2), function(error) {
                        if(error) {
                            console.log(error);
                            return console.log("Could not write to " + filePath);
                        }
                        console.log(filePath + " successfully saved.");
                        callback(null, result);
                    });
                });
            } else {
                var currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0, 0);
                var lastModified = new Date(stats.mtime);
                lastModified.setHours(0, 0, 0, 0, 0);

                if(currentDate.getTime() == lastModified.getTime()) {
                    fs.readFile(filePath, function(error, content) {
                        if(error) {
                            console.log(error);
                            return console.log("Could not read " + filePath);
                        }

                        console.log("Current file " + filePath + " is still fresh.");
                        callback(null, JSON.parse(content));
                    });
                } else {
                    dataRetrieveFunction(repoName).then(function(result) {
                        fs.writeFile(filePath, JSON.stringify(result, null, 2), function(error) {
                            if(error) {
                                console.log(error);
                                return console.log("Could not write to " + filePath);
                            }
                            console.log(filePath + " successfully saved.");
                            callback(null, result);
                        });
                    });
                }
            }
        });
    }
}


module.exports = {
	init: init,
	generateData: generateData
}