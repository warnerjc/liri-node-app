// read and set environment variables
require("dotenv").config();

// required packages for LIRI application
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");
const fs = require("fs");
const keys = require("./liri-api-keys/keys");

// assign keys to declared variables
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

let args = [];

// store user arguments in args array
for (let i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i]);
}

// function with switch statement to run proper action block
function doThisAction() {

    switch (args[0]) {
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
}

// function to display 20 most recent user tweets
function getTweets() {
    let params = {
        screen_name: args[1],
        count: 20,
        result_type: "recent",
        lang: "en"

    };

    console.log("Tweets from " + args[1] + ":");
    console.log("");

    client.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (!error) {
            for (let j = 0; j < tweets.length; j++) {
                console.log(tweets[j].created_at + ": " + tweets[j].text);
            }
        } else {
            console.log("Code " + error[0].code + " - " + error[0].message);
        }
    });

}

// function to display song information
function getSong() {

    if (args[1] === undefined) {
        spotify
            .request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
            .then(function (data) {
                console.log("Must be The Sign, cuz you didn't search for anything...");
                console.log("");
                console.log("Artist(s): " + data.artists[0].name);
                console.log("Song Name: " + data.name);
                console.log("Song Link: " + data.external_urls.spotify);
                console.log("Song Album: " + data.album.name);
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    } else {
        spotify.search({ type: "track", query: args[1] }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
            } else {
                let songInfo = data.tracks.items[0];

                console.log("Your search for " + args[1] + " returned the following song...");
                console.log("");
                console.log("Artist(s): " + songInfo.artists[0].name);
                console.log("Song Name: " + songInfo.name);
                console.log("Song Link: " + songInfo.external_urls.spotify);
                console.log("Song Album: " + songInfo.album.name);
            }
        });
    }

}

// function to display movie information
function getMovie() {

    if (args[1] === undefined) {
        request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                console.log(`Movie Title: ${JSON.parse(body).Title} \nMovie Year: ${JSON.parse(body).Year} \nIMDB Rating: ${JSON.parse(body).Ratings[0].Value} \nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value} \nCountry: ${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nPlot: ${JSON.parse(body).Plot} \nActors: ${JSON.parse(body).Actors}`);
            }
        });
    } else {

        let myMovie = args[1].split(" ").join("+");

        request("http://www.omdbapi.com/?t=" + myMovie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                console.log(JSON.parse(body));

                console.log(`Movie Title: ${JSON.parse(body).Title} \nMovie Year: ${JSON.parse(body).Year} \nIMDB Rating: ${JSON.parse(body).Ratings[0].Value} \nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value} \nCountry: ${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nPlot: ${JSON.parse(body).Plot} \nActors: ${JSON.parse(body).Actors}`);

            }
        });
    }
}

// function to display action from random.txt
function getAction() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        let dataArr = data.split(",");

        args[0] = dataArr[0];
        args[1] = dataArr[1].replace(/"/g,"");

        doThisAction();

    });
}

doThisAction();