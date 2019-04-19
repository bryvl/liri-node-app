require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var axios = require('axios');

var moment = require('moment');

var fs = require('fs');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];

var runCommandOn = process.argv.slice(3).join(' ');

// run a function for whatever the command the user put in was
var runCommand = function(whichCommand, searchTerm) {
    switch (whichCommand) {
    case "concert-this":
        bandsSearch(searchTerm);
        break;
    case "spotify-this-song":
        spotifySearch(searchTerm);
        break;
    case "movie-this":
        omdbSearch(searchTerm);
      break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Error: Please type in a valid command...");
    }
};


// defining function for 'movie-this' command
var omdbSearch = function(movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    
    if (process.argv.length < 3) {
        // queryUrl is not giving Mr nobody when movie is undefined...
        movie = 'Mr Nobody';
    }
    
    console.log(queryUrl);

    axios.get(queryUrl).then(function(response) {
        var returnedData = response.data;

        console.log("\n" + "-----------------------------");
        console.log("Title: " + returnedData.Title);
        console.log("Relase Year: " + returnedData.Year);
        console.log("Rated: " + returnedData.Rated);
        console.log("IMDB Rating: " + returnedData.imdbRating);
        console.log("Country: " + returnedData.Country);
        console.log("Language: " + returnedData.Language);
        console.log("Plot: " + returnedData.Plot);
        console.log("Actors: " + returnedData.Actors);
        console.log("Rotten Tomatos Rating: " + returnedData.Ratings[1].Value);


        if(returnedData.Title === "The Road to El Dorado") {
            console.log("Recommendation: Don't listen to Rotten Tomatos; this movie made me who I am!");
        }
        console.log("-----------------------------" + "\n");
        
        }
    );
};

runCommand(command, runCommandOn);