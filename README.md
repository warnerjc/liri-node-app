# LIRI
Language Interpretation and Recognition Interface

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

## User must provide own API keys for application to function properly

## Language(s)
1. JavaScript & Node.JS - code for command line LIRI application

## Required Packages & Files
1. .env - environment file holding user's own API keys (Spotify & Twitter)
2. dotenv - node npm package for environment files (npm install dotenv --save)
4. node-spotify-api - node npm package for Spotify requests (npm install --save node-spotify-api)
5. twitter - node npm package for Twitter requests (npm install twitter)
6. request - node npm package for http(s) requests (npm install request)
7. fs - node npm package for file system functionality

## LIRI Bot Commands - Current as of 4/12/2018
LIRI currently accepts the following commands
    
  * my-tweets `user-name` [Will return 20 most recent user Twitter tweets if username is valid]
  * spotify-this-song `song-title` [Will return best match on Spotify if the song title is valid]
  * movie-this `movie-title` [Will return best match on OMDB if the movie title is valid]
  * do-what-it-says [Will read action from random.txt and execute proper action block]

### BONUS

* In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

* Make sure you append each command you run to the `log.txt` file. 

* Do not overwrite your file each time you run a command.