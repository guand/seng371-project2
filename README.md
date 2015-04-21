# SENG 371 - Project 2
Software evolution research on open-source projects by Jian Guan (@guand), Paul Moon (@paulmoon), and Jonathan Lam (@lamj1234).

#### Table of Contents  
##### [1.0 Project Question & Hypotheses](#Introduction)

##### [2.0 Methodology](#Methodology)
* [2.1  Codebases chosen for analysis](#Codebases)
* [2.2 Tools](#Tools)

##### [3.0 Quick Start](#Start)
* [3.1 Requirements](#Requirements)
* [3.2 Running the Server](#Server)

##### [4.0 Results & Analysis](#RA)
* [4.1 Results](#Results)
* [4.2 Analysis](#Analysis)
  * [4.2.1 AngularJS](#AngularJS)
  * [4.2.2 Bootstrap](#Bootstrap)
  * [4.2.3 NodeJS](#Node)
  * [4.2.4 Overall Analysis](#Overall)
  * [4.2.5 Threats to Validity](#Threats)
  * [4.2.6 Future Work](#Future)

##### [5.0 5.0 Milestones](#5.0 Milestones)

<a name="Introduction"/>
### 1.0 Project Question & Hypotheses
***How are different types of GitHub activities, such as number of pull requests and number of issues over time, correlated with user satisfaction?***

We will attempt to answer this question by sentiment-analyzing text from software communities such as HackerNews and Reddit, graphed against the number of GitHub issues and pull requests for the same repository.

#### Hypotheses
- As user satisfaction increases, the number of issues will increase because high user satisfaction will promote discussion and recommendations, which will increase the number of users and therefore the number of bugs and issues.
- The number of pull requests will be correlated with user satisfaction. The pull requests will introduce new features, refactor the codebase, and fix bugs, which will increase user satisfaction.

<a name="Methodology"/>
### 2.0 Methodology
<a name="Codebases"/>
#### 2.1  Codebases chosen for analysis
The tool was built so that the user can specify ANY repository. For our analysis we chose the following codebases:
- [Angular](https://github.com/angular/angular)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [NodeJS](https://github.com/joyent/node)

These projects were chosen because the software industry are familiar with these frameworks and generate lots of discussion around them, which will be crucial for our sentimental analysis.
<a name="Tools"/>
#### 2.2  Tools
We used the following tools:

- [GitHub API](https://developer.github.com/v3/): The GitHub API allowed us to obtain the number of issues and pull requests (merged into master) for any repository.
- [d3.js](http://d3js.org/): The D3.js library was used to graph our results programmatically.
- Various npm modules including:
  - [async](https://www.npmjs.com/package/async): Fetching data asynchronously.
  - [express](https://www.npmjs.com/package/express): Web application framework.
  - [github](https://www.npmjs.com/package/github): JavaScript wrapper around the GitHub API.
  - [hacker-news-api](https://www.npmjs.com/package/hacker-news-api): Javascript wrapper around HackerNews API.
  - [jade](https://www.npmjs.com/package/jade): Templating engine.
  - [lodash](https://www.npmjs.com/package/lodash): Javascript utility library.
  - [nodemon](https://www.npmjs.com/package/nodemon): Reloads the server upon source code changes.
  - [q](https://www.npmjs.com/package/q): Promises. See: https://github.com/kriskowal/q
  - [qs](https://www.npmjs.com/package/qs): Querystring library.
  - [sentiment](https://www.npmjs.com/package/sentiment): Sentiment analysis tool.
  - [snoocore](https://www.npmjs.com/package/snoocore): Javascript wrapper around Reddit.
- Bootstrap for styling

##### Metrics Gathered
- List of all GitHub issues.
- List of GitHub pull requests merged into master.
<a name="Start"/>
### 3.0 Quick Start
<a name="Requirements"/>
#### 3.1 Requirements
- Access Token for Git API: To get an access token, follow these menu items on the GitHub site: Profile -> Settings -> Applications -> Personal Access Token -> Generate Token.
- Node.js
- **Firefox is recommended over Chrome due to styling issues**
<a name="Server"/>
#### 3.2 Running the Server
1. `git clone git@github.com:guand/seng371-project2.git`
1. `npm install`
2. Put your GitHub auth token in auth/auth.json.
3. `node server.js`

You should be able to visit `http://localhost:9001/` and start using the tool right away! We provided a tour of our tool, as seen below.

![screen shot 2015-04-21 at 2 35 49 pm](https://cloud.githubusercontent.com/assets/1689157/7263120/bd302eaa-e833-11e4-9153-e7e52d16e750.png)
<a name="RA"/>
### 4.0 Results & Analysis
<a name="Results">
#### 4.1  Results
Below are the graphs showing the relationship between user satisfaction & various GitHub activities vs. time.
##### AngularJS
User satisfaction & GitHub issues vs. time.
![AngularJS result](https://cloud.githubusercontent.com/assets/5192167/7262587/c2e1b9bc-e82f-11e4-8d82-235b9961721e.png)

User satisfaction & GitHub pull requests vs. time.
![angularjs-pr](https://cloud.githubusercontent.com/assets/5192167/7262589/c70fb3a4-e82f-11e4-901d-9b8daf8b8032.png)

##### Bootstrap
User satisfaction & GitHub issues vs. time.
![Bootstrap result](https://cloud.githubusercontent.com/assets/5192167/7262576/b5523ede-e82f-11e4-96de-02ec3f8e707e.png)

User satisfaction & GitHub pull requests vs. time.
![Bootstrap-pr](https://cloud.githubusercontent.com/assets/5192167/7262676/50ec2512-e830-11e4-9690-1d7f72b10e9c.png)

##### Node.js
User satisfaction & GitHub issues vs. time.
![Node.js](https://cloud.githubusercontent.com/assets/5192167/7262623/ff34de80-e82f-11e4-8842-75437fd19d49.png)

User satisfaction & GitHub pull requests vs. time.
![Node.js-pr](https://cloud.githubusercontent.com/assets/5192167/7262621/f9d411b8-e82f-11e4-8983-549144ddf437.png)
<a name="Analysis">
#### 4.2  Analysis
Our hypothesis was that the user satisfaction increases, the number of issues will increase because high user satisfaction will promote discussion and recommendations.
<a name="AngularJS">
##### 4.2.1 AngularJS
From 2011 to the beginning of 2014, the graph shows a steady increase in the number of GitHub issues. During the same period, the sentiment score scatterplot shows an increase in the number of data points as well as the sentiment scores, suggesting a correlation as suggested by our first hypothesis. However, from the beginning of 2015 to the present, the number of GitHub issues are sharply increasing whereas the sentimental scores are at a relatively constant level, albeit with few extremely negative comments. This phenomenon is likely explained by the development of AngularJS 3, and the increasing popularity of AngularJS. The pull request graph was deemed inconclusive because of the density of the scatterplots.
<a name="BootStrap">
##### 4.2.2 Bootstrap
The graph shows that Bootstrap began tracking issues around 2012 when it started to become popular as shown by many positive reviews in Reddit. The Github pull request graph shows that Bootstrap began tracking pull requests around 2014 when Bootstrap was becoming increasingly popular as shown by both Reddit and HackerNews' scatterplots. The GitHub issues and pull requests continues to increase as user satisfaction increases. The results support our hypotheses that as user satisfaction increases, the number of issues will increase due to user discussion and recommendations, as well as the number of pull requests being correlated with user satisfaction.
<a name="Node">
##### 4.2.3 Node.js
The graph of GitHub issues show that the Reddit scatterplot has the overall sentiment scores increasing with the rising number of GitHub issues, supporting our first hypothesis. The GitHub pull requests also show that there is a correlation between the number of pull requests and the increasing sentimental scores. The HackerNews graph shows no change in the overall sentiment scores over time.
<a name="Overall">
##### 4.2.4 Overall Analysis
We realized that it's difficult to get a very positive sentiment analysis score. The sentiment analyzer uses a wordlist named [AFINN-111](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) to assign a score to certain words. For example, "breathtaking" has a score of +5 whereas "disgusting" has a score of -3. This means that to obtain high sentiment scores (50+), one needs to write an incredibly long paragraph that speaks highly of these repositories, which is unlikely in a forum such as Reddit and HackerNews. However, we noted that as popularity of a repository increases, the number of sentiment scores from 0-40 increased as well, suggesting that the overall sentiment is maintained. 

As a repository gains popularity, it's unlikely that the sentiment scores will be **directly** correlated with the number of issues. Software developers on these forums are discussing the pros and cons of these repositories as popularity increases, which means it's difficult for the overall sentiment score to keep rising with the popularity.

The first hypothesis was supported by all GitHub issues graphs as shown by the individual analyses. The second hypothesis, that the number of pull requests are correlated with sentiment scores, the Bootstrap and AngularJS graphs had the scatterplots too dense to visualize the increase in data plots, which would suggest an increase in sentiment scores. Therefore the second hypotheses was deemed inconclusive with our current method of visualizing the data.
<a name="Threats">
##### 4.2.5 Threats to Validity 
We implemented a on-mouseover tooltip function that shows the text of each Reddit/HackerNews data point. 

![screen shot 2015-04-21 at 2 27 53 pm](https://cloud.githubusercontent.com/assets/1689157/7262994/b6ea768c-e832-11e4-95ba-f724bc241a3c.png)

This revealed many threats the validity of this study:
- The Reddit and HackerNews API searching feature behaves in a way that if a body of text contains even a single instance of the query term, the entire body is returned, and we analyze the entire body of text. For larger paragraphs, some text might not be related at all to the repository.
- Some of the repository names are commonly used in English, so the context of the text may not be related to software at all. For example, angular may be used in the context of physics, like angular momentum, and "Bootstrap" may be used in the context of bootstrapping something. The worst one was "node", where people on Reddit talked about Bitcoin mining nodes, game items etc.
- The sentiment scores are additive, so longer paragraphs will have more extreme values compared to shorter comments. This may affect our results.
<a name="Future">
##### 4.2.6 Future Work
- Normalize the scores so that lengthier text do not skew sentiment scores.
- Implement more GitHub statistics such as LOC, number of committers etc.
- Implement more text sources such as Quora, StackOverflow etc.
- Make the visualization better, and provide multiple methods of visualization methods such as a stacked bar graph for sentiment scores.
- Detect the context of the text and eliminate ones that are not related to the repository.
<a name="Milestones">
### 5.0 Milestones
| Tasks | Values (out of 10) | Estimations | Risks (1-10, 1 least risky) | Status |
|--- |---	|---	|---	|--- |
| Write tool for pull GitHub activities  | 3 | 2 hours | 2 | **Complete** |
| Write tool for scraping and extracting Reddit and HackerNews | 7 | 6 hours | 5 | **Complete** |
| Write tool for running sentimental analysis on any text | 4 | 2 hours | 5 | **Complete** |
| Write D3.js code to display interactive graphs | 8 | 12 hours | 8 | **Complete** |
| Bootstrap & write Node.js code for server and client | 6 | 5 hours | 3 | **Complete** |

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
