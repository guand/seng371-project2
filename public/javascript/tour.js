var tour = new Tour({
  steps: [
    {
      title: "Introduction",
      content: "Take a tour to learn how to use our project!",
      orphan: true,
      backdrop: true
    },
    {
      element: "#repoName",
      title: "Search for a GitHub Repo",
      content: "Type in the name of the GitHub Repo that you want to look at for its user satisfaction over time. ",
      placement: "bottom"
    },
    {
      element: "#search-button",
      title: "Start Searching",
      content: "Click on the 'Search' button to start!",
      placement: "right"
    },
    {
      element: "#result-graph",
      title: "Result",
      content: "A graph will be generated as a result to show the number of pull requests and number of issues over time, correlated with user satisfaction",
      placement: "right"
    },
    {
      element: "#github-page",
      title: "GitHub Page",
      content: "For more information about our project, click here to go to our GitHub page!",
      placement: "bottom"
    }
  ],
  orphan: true,
  backdrop: true
});

$(document).ready(function() {
  $(".take-tour").click(function() {
    tour.init();

    // have to use restart instead of start because 
    // if users click end tour before the end of the
    // tour, the tour will break.
    tour.restart();
  });
});