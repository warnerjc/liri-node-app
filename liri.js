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

// global storage array for LIRI command line arguments
let args = [];

// global storage strings for log file
let log = "";
let command = "";

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
            console.log("User action not recognized.");

    }
}

// function to display 20 most recent user tweets from Twitter
function getTweets() {

    // clear global log string
    log = "";

    let params = {
        screen_name: args[1],
        count: 20,
        result_type: "recent",
        lang: "en"

    };

    // if no username provided, then default to twitter user @nodejs
    // else use twitter username provided
    if (args[1] === undefined) {

        params.screen_name = "nodejs";

        console.log(`Tweets from ${params.screen_name}:`);
        console.log(``);

        command = args[0];
        log = log + command;
        log = log + (`\nTweets from ${params.screen_name}:\n`);

        // get tweets based on assigned params
        client.get("statuses/user_timeline", params, function (error, tweets, response) {

            // display most recent user tweets up to 20
            if (!error) {
                for (let j = 0; j < tweets.length; j++) {
                    console.log(`${tweets[j].created_at}: ${tweets[j].text}`);
                    log = log + (`${tweets[j].created_at}: ${tweets[j].text}\n`);
                }

                logData(log);
            } else {
                console.log(`Code ${error[0].code} - ${error[0].message}`);
                log = log + (`${tweets[j].created_at}: ${tweets[j].text}\n`);

                logData(log);
            }
        });

    } else {

        console.log(`Tweets from ${args[1]}:`);
        console.log(``);

        command = args[0] + " " + args[1];
        log = log + command;
        log = log + (`\nTweets from ${params.screen_name}:\n`);

        // get tweets based on assigned params
        client.get('statuses/user_timeline', params, function (error, tweets, response) {

            // display most recent user tweets up to 20
            if (!error) {
                for (let j = 0; j < tweets.length; j++) {
                    console.log(`${tweets[j].created_at}: ${tweets[j].text}`);
                    log = log + `${tweets[j].created_at}: ${tweets[j].text}\n`;
                }

                logData(log);
            } else {
                console.log(`Code ${error[0].code} - ${error[0].message}`);
                log = log + `${tweets[j].created_at}: ${tweets[j].text}\n`;

                logData(log);
            }
        });
    }
}

// function to display song information from Spotify
function getSong() {

    // if no song provided, default to "The Sign" by Ace of Base
    // else search Spotify for the requested song information
    if (args[1] === undefined) {

        // request to specific "The Sign" by Ace of Base API URL
        spotify
            .request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
            .then(function (data) {
                console.log(`Must be The Sign, cuz you didn't search for anything...`);
                console.log(`\nArtist(s): ${data.artists[0].name} \nSong Name: ${data.name} \nSong Link: ${data.external_urls.spotify} \nSong Album: ${data.album.name}`);
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    } else {
        spotify.search({ type: "track", query: args[1] }, function (err, data) {

            if (err) {
                console.log(`Error occurred: ${err}`);
            } else {
                let songInfo = data.tracks.items[0];

                console.log(`Your search for ${args[1]} returned the following song...`);
                console.log(`\nArtist(s): ${songInfo.artists[0].name} \nSong Name: ${songInfo.name} \nSong Link: ${songInfo.external_urls.spotify} \nSong Album: ${songInfo.album.name}`);
            }
        });
    }
}

// function to display movie information from OMDB
function getMovie() {

    // clear global log string
    log = "";

    // if no movie provided, default to "Mr Nobody"
    // else search OMDB with the user provided movie
    if (args[1] === undefined) {
        request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {

            if (!error && response.statusCode === 200) {

                console.log(`Movie Title: ${JSON.parse(body).Title} \nMovie Year: ${JSON.parse(body).Year} \nIMDB Rating: ${JSON.parse(body).Ratings[0].Value} \nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value} \nCountry: ${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nPlot: ${JSON.parse(body).Plot} \nActors: ${JSON.parse(body).Actors}`);
            }
        });
    } else {
        // split and join the movie argument with + for API URL request semantics
        let myMovie = args[1].split(" ").join("+");

        request("http://www.omdbapi.com/?t=" + myMovie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

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

        if (error) {
            return console.log(error);
        }

        // split the random.tx data string into a array of strings at the comma break
        let dataArr = data.split(",");

        args[0] = dataArr[0];
        args[1] = dataArr[1].replace(/"/g, "");

        // call doThisAction to find which action block to take
        doThisAction();

    });
}

// function to log command line arguments & action block callbacks
// currently only logging my-tweets
function logData(log) {
    var stream = fs.createWriteStream("log.txt", { flags: 'a' });

    var date = new Date().toISOString();

    stream.write(`${date}\n`);
    stream.write(`${log}\n\n`);
    stream.end();
}

// call doThisAction after command line arguments received and determine which action block to take
doThisAction();