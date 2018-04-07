// read and set environment variables
require("dotenv").config();

// required packages for LIRI application
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");
const keys = require("./liri-api-keys/keys");

// assign keys to declared variables
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

let args = [];

// store user arguments in args array
for (let i = 2; i <process.argv.length; i++) {
    args.push(process.argv[i]);
}

// switch statement to run proper action block
switch(args[0]) {
    case "my-tweets":
        getTweets();
        break;

    case "spotify-this-song":
        getSong();
        break;

    case "movie-this":
        getMovie();
        break;

    case "do-what-it-says":
        getAction();
        break;

    default:
        console.log("User selected action not recognized.");

}

// function to display 20 most recent user tweets
function getTweets() {

}

// function to display song information
function getSong() {

}

// function to display movie information
function getMovie() {

}

// function to display action from random.txt
function getAction() {
    
}