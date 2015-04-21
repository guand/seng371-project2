$(document).ready(function() {
  // Get query string value from the URL. http://stackoverflow.com/a/901144
  function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var repoName = getParameterByName("repoName");

  d3.json("data/" + repoName) 
  .on("progress", function() {
    // TODO: Implement progress bar.
    console.log("Progressing");
  })
  .get(function(err, json) {
    //- Load data for all of our sources from the sources.
  $(".loading").hide();
  var defaultColors = ["reddit", "hackerNews", "GitHub Issues"];
  var x, y, yGitHub, yGitHubAxis, data, currentGitHubDataType;
  var parseDate = d3.time.format("%Y-%m-%d").parse;
  var parseFullDate = d3.time.format.utc("%Y-%m-%dT%H:%M:%SZ").parse;
  var colors = d3.scale.category10();

  var axisLabels = {
    issues: "GitHub Issues",
    pullRequests: "GitHub Pull Requests"
  };

  var margin = {
    top: 20,
    right: 50,
    bottom: 30,
    left: 30
  };

  var width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var svg = d3.select(".main-chart").append("svg")
    .attr("id", "result-graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // Border around the graph
  var borderPath = svg.append("rect")
   .attr("x", 0)
   .attr("y", 0)
   .attr("height", height)
   .attr("width", width)
   .style("stroke", "grey")
   .style("fill", "none")
   .style("stroke-width", 1.5);
  // Consolidate all the dates & sentiment scores to properly set the min/max extent of axis.
  var allDates = [];
  // Sentiment scores
  var allScores = [];
  currentGitHubDataType = "GitHub Issues";
  data = json; 

  // Sort GitHub issues/pull requests chronologically.
  json.gitHub.issues = _.sortBy(json.gitHub.issues, function(d) {
    return d.created_at;
  });

  json.gitHub.pullRequests = _.sortBy(json.gitHub.pullRequests, function(d) {
    return d.created_at;
  });

  // Reddit dates are given in epoch time (seconds since 1970)
  for (var i = 0; i < json.reddit.length; i++) {
    json.reddit[i].date = new Date(json.reddit[i].date * 1000);
    json.reddit[i].score = +json.reddit[i].score;
    json.reddit[i].data_type = "reddit";
    allDates.push(json.reddit[i].date);
    allScores.push(json.reddit[i].score);
  }

  // HackerNews dates are in YYYY-MM-DD form
  for (var i = 0; i < json.hackerNews.length; i++) {
    json.hackerNews[i].date = parseDate(json.hackerNews[i].date);
    json.hackerNews[i].score = +json.hackerNews[i].score;
    json.hackerNews[i].data_type = "hackerNews";
    allDates.push(json.hackerNews[i].date);
    allScores.push(json.hackerNews[i].score);
  }

  for (var i = 0; i < json.gitHub.issues.length; i++) {
    json.gitHub.issues[i].date = parseFullDate(json.gitHub.issues[i].created_at);
    json.gitHub.issues[i].score = i + 1;
    allDates.push(json.gitHub.issues[i].date);
  }

  for (var i = 0; i < json.gitHub.pullRequests.length; i++) {
    json.gitHub.pullRequests[i].date = parseFullDate(json.gitHub.pullRequests[i].created_at);
    json.gitHub.pullRequests[i].score = i + 1;
    allDates.push(json.gitHub.pullRequests[i].date);
  }

  x = d3.time.scale()
    .domain(d3.extent(allDates))
    .range([0, width]);

  y = d3.scale.linear()
    .domain(d3.extent(allScores))
    .range([height, 0]);

  // Draw GitHub issues by default
  yGitHub = d3.scale.linear()
    .domain([0, json.gitHub.issues.length])
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  yGitHubAxis = d3.svg.axis()
    .scale(yGitHub)
    .orient("right");

  var xMap = function(d) { 
    return x(d.date);
  };

  var yMap = function(d) {
    return y(d.score);
  };

  var gitHubLine = d3.svg.line()
    .x(function (d) { return x(d.date) })
    .y(function (d) { return yGitHub(d.score) });

  // Scatterplot for HackerNews
  svg.selectAll(".hackerNews.dot")
  .data(json.hackerNews)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", 3.5)
  .attr("cx", xMap)
  .attr("cy", yMap)
  .style("fill", function (d) { 
    return colors(d.data_type);
  });

  // Scatterplot for Reddit
  svg.selectAll(".reddit.dot")
  .data(json.reddit)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", 3.5)
  .attr("cx", xMap)
  .attr("cy", yMap)
  .style("fill", function (d) { 
    return colors(d.data_type);
  });

  // Line graph for GitHub
  svg.append("path")
  .attr("class", "path")
  .attr("d", gitHubLine(json.gitHub.issues))
  .style("stroke", colors(currentGitHubDataType));

  // x axis line and label
  svg.append("g")
  .attr("id", "xAxis")
  .attr("class", "axis")
  .attr("transform", "translate(0, " + height + ")")
  .call(xAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("x", width - 6)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Date");

  // Sentiment score y axis and label
  svg.append("g")
  .attr("id", "yAxis")
  .attr("class", "axis")
  .call(yAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -6)
  .attr("dy", "1em")
  .style("text-anchor", "end")
  .text("Sentiment Score");

  // GitHub y axis and label 
  svg.append("g")
  .attr("id", "yGitHubAxis")
  .attr("class", "axis")
  .attr("transform", "translate(" + width + ", 0)")
  .call(yGitHubAxis)
  .append("text")
  .attr("id", "yGitHubAxisLabel")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -6)
  .attr("y", -20)
  .attr("dy", "1em")
  .style("text-anchor", "end")
  .text("GitHub Issues");
      
  // Chart title
  svg.append("text")
  .attr("id", "chartTitle")
  .attr("transform", "translate(" + (width / 2) + ", 35)")
  .style("text-anchor", "middle")
  .attr("class", "h3")
  .text(capitalize(repoName));


  d3.select("#githubOptions")
    .on("change", function() {
      var newData = d3.select(this).node().value;
      redrawGraph(newData);
  });

  configColors();
  redrawLegend();

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Put the data types into the color domain. Need to configure it based on different GitHub data types
  // to redraw the legend.
  function configColors(dataTypes) {
    colors = d3.scale.category10();

    if (!dataTypes) {
      dataTypes = defaultColors;
    }

    for (var i = 0; i < dataTypes.length; i++) {
      colors(dataTypes[i]);
    }
  }

  function redrawLegend() {
    var legend = svg.selectAll(".legend")
        .data(colors.domain())
      .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + -(width - 30) + ", " + (i * 25 + height - 25 * colors.domain().length) + ")"; })
        .attr("orient", "right");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colors);

    legend.append("text")
      .attr("x", width + 10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { 
        // Capitalize labels in the legend.
        return capitalize(d);
      });
  }

  // Redraw GitHub data, redraw legend with the new GitHub data type
  function redrawGraph(gitHubDataType) {
    currentGitHubDataType = gitHubDataType;

    yGitHub = d3.scale.linear()
      .domain([0, data.gitHub[currentGitHubDataType].length])
      .range([height, 0]);

    var yGitHubAxis = d3.svg.axis()
      .scale(yGitHub)
      .orient("right");

    // Line graph for GitHub
    var gitHubLine = d3.svg.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return yGitHub(d.score) });

    //svg.transition();

    // Reconfigure the color domain/range to include the new GitHub data type
    configColors(["reddit", "hackerNews", currentGitHubDataType]);
    // Redraw the legend
    redrawLegend(["reddit", "hackerNews", currentGitHubDataType]);

    svg.select("#yGitHubAxis")
        .call(yGitHubAxis)
      .select("text.axis-label")
      .text(axisLabels[currentGitHubDataType]);

    svg.select(".path")
      .attr("class", "path")
      .attr("d", gitHubLine(data.gitHub[currentGitHubDataType]))
      .style("stroke", colors(currentGitHubDataType));

    }
  });

});
