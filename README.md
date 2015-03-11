### Research Question
How are different types of GitHub activites, such as number of pull requests and number of issues over time, correlated with user satisfaction?

### Hypotheses
1. As user satisfaction increases, the number of issues will increase because high user satisfaction will promote discussion and recommendations, which will increase the number of users and therefore the number of bugs / issues.
2. The number of pull requests will be correlated with user satisfaction. The pull requests will introduce new features, refactor the codebase, and fix bugs, which will increase user satisfaction.

### Detailed project plan
#### User Story
As a user interested in GitHub and software evolution, I want to be able to see a graph of user satisfaction & GitHub activities vs. time, and I want to be able to select which GitHub activity to graph (e.g. number of issues, number of commits). 

#### Requirements & Specifications
- [Issue #1](https://github.com/guand/seng371-project2/issues/1): Write Python/Javascript code to query GitHub API and retrieve the following GitHub activities for any repo name that the user provides:
  - Number of GitHub issues over time
  - Number of GitHub stars over time
  - Number of GitHub pull requests into master over time
  - Number of commits to master over time
  - Number of contributors over time
- [Issue #2](https://github.com/guand/seng371-project2/issues/2): Write a Python/Javascript bot to query Reddit and HackerNews for text which contains the repo name. There are APIs on GitHub that we can use.
- [Issue #3](https://github.com/guand/seng371-project2/issues/3): Write Python/Javascript code to run sentiment analysis on the posts and comments for overall sentiment. Many libraries exist for this e.g. https://github.com/thisandagain/sentiment.
- [Issue #4](https://github.com/guand/seng371-project2/issues/4): Write D3.js code to graph user satisfaction & various GitHub activities vs. time. Similar to [this graph](http://www.nytimes.com/interactive/2013/03/29/sports/baseball/Strikeouts-Are-Still-Soaring.html).

The scripts will be written so that the user can provide the name of a repo to analyze, but the project will specifically analyze AngularJS, Bootstrap, and Node.js repositories.

### Values, Estimations, and Risks

| Tasks | Values (out of 10) | Estimations | Risks	(1-10, 1 least risky)|
|--- |---	|---	|---	|
| Write tool for pull GitHub activities  | 3 | 2 hours | 2 |
| Write tool for scraping and extracting Reddit and HackerNews | 7 | 6 hours | 5 |
| Write tool for running sentimental analysis on any text | 4 | 2 hours | 5 |
| Write D3.js code to display interactive graphs | 8 | 12 hours | 8 |
| Bootstrap & write Node.js code for server and client | 6 | 5 hours | 3 |

### Milestones
#### Milestone 1 - March 10, 2015
- Prepare a detailed project plan.

#### Milestone 2 - March 17, 2015
- Implement a tool to pull all GitHub activities over time, for any repo.
- Implement a tool to query Reddit and HackerNews and collect text containing repo name.

#### Milestone 3 - March 24, 2015
- Write code to run sentimental analysis on any given text.
- Write D3.js code to graph the results.

#### Milestone 4 - March 30, 2015
- Polish the tools
- Thoroughly analyze the three repositories from the generated graphs
- Finish project report

### Collaborators
* Jian Guan @guand
* Jonathan Lam @lamj1234
* Paul Moon @paulmoon
