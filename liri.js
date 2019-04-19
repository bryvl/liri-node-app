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
    };
};

// defining function for movie-this command
var bandsSearch = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(function(response) {
        var returnedData = response.data;
        // console.log(returnedData);
        
        console.log("\nConcert Results For " + artist + ":");
  
        for (var i = 0; i < returnedData.length; i++) {
            var show = returnedData[i];
            
            console.log("\n");
            console.log((i + 1) + ": " + show.venue.city + ", " + (show.venue.region || show.venue.country));
            console.log("Venue: " + show.venue.name);
            console.log("Concert Date: " + moment(show.datetime).format("MM/DD/YYYY"));
            console.log("--------------------------------");
        };
    });
};



// defining function for spotify-this-song command
var spotifySearch = function(song) {
    // song isn't working here as undefined or as process.argv < 3 either. 
    if (song === undefined) {
      song = "The Sign";
    }
  
    spotify.search({type: 'track', query: song}, function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
    
        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            // not getting the artist name back for some reason
            console.log("Artist(s): " + songs[i].artists.name);
            console.log("Song Name: " + songs[i].name);
            // not every song has a preview url
            console.log("Preview Song: " + songs[i].preview_url);
            console.log("Album: " + songs[i].album.name);
            console.log("-----------------------------------\n");
        }
    });
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

// use random.txt to get whatever its contents are and run those through Liri
// should work on any command, not just default spotify search text put in
var doWhatItSays = function() {
    // fs readfile to take 
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        var dataArray = data.split(",");
        runCommand(dataArray[0], dataArray[1]);
    });
};

runCommand(command, runCommandOn);