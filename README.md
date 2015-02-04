Tweetrivia

Vision and Scope
Primary Features
We aim to create a who-said trivia game that uses Twitter to get the questions. We will build a database to save highscores as well as groups of famous Twitter users. Users will login via Twitter to keep track of friends, highscores, and who they’re following.

The user selects a category of their choice: movie stars, NFL players, bands, following, etc. The game then starts and shows the user a tweet and four (subject to change) famous (above x number of followers) Twitter users that fall into that category. Three will be random, and one will be the Twitter user who tweeted the tweet. If the user guesses correctly, they will move on to the next question and gain a point, repeated until the max number of questions has been reached. Tweets will be displayed as uncopyable text and there will be a time limit for each question to prevent cheating.

Secondary Features
    If there is time left over after the primary features are implemented we will add some secondary features. We can add an alternate game mode where the user will be presented with one Twitter account and must choose a tweet that that Twitter account tweeted. Consecutive correct answers could start a score multiplier. The timer may decrease as the user answers correctly several times in a row. Users may see their high scores on leaderboards, sectioned off by category, to compare to their friends.



Team

Name
Role
Tim Mendez
Scrum Master
Varsha Roopreddy
Team
Forrest Hansen
Team
Yuliya Levitskaya
Team


Low-Fidelity Prototype

REST API
We are using the following APIs:

Twitter REST API:
We are gathering tweets from Twitter users and requiring login with Twitter.

Parse:
We are building and querying a database consisting of Javascript objects representing categories consisting of Twitter usernames.


