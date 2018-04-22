
var twitter = require("twitter"); 
var spotify = require("node-spotify-api"); 
var request = require("request");
var fs = require("fs"); 
var keys = require("./keys"); 

var liriCommand = process.argv[2]; 
var inputData = process.argv[3]; 

function start(liriCommand){
    switch(liriCommand){
        case "my-tweets":
            getTweets();
        break; 

        case "spotify-this-song":
        spotifyThisSong( inputData );
        break; 

        case "movie-this":
        movieThis( inputData ); 
        break; 

        case "do-what-i-say":
        doWhatISay(); 
        break;

        default:
        console.log("Not a valid command !"); 
    }     
}


function getTweets(){
   
   var client = new twitter(keys.twitter) ;
   var params = {screen_name:"nyt", count:20};
    //console.log(params); 
    client.get("statuses/user_timeline", params, function(error, tweets, response){
        if(!error){
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
            }
        }
    }); 
}

//Search a song with Spotify 
function spotifyThisSong( songName ){
    var client = new spotify(keys.spotify);   
    
    if (songName === undefined) {
        songName = "The Sign";
      }

    client.search(
        {
            type:'track',
            query: songName,
            limit: 10
        }, 
        function(err, data){
            if(err){
            return console.log('Error Occured: ' + err ); 
        }
        var numberofSongs = data.tracks.items.length;
        var tracks = data.tracks.items; 

        for(var i = 0; i < numberofSongs; i++){      
           
            tracks[i].artists.forEach(function(artist){
                console.log("Artist(s): " + artist.name); 
            });     
            console.log("Song Name: "+ tracks[i].name); 
            console.log("Preview URL:" + tracks[i].preview_url); 
            console.log("Album:" + tracks[i].album.name); 
            console.log(); 
            
        }
    }); 

    //https://api.spotify.com/v1/search
}

//Movie 
function movieThis(movie){
    if (movie === undefined) {
        movie = "Mr Nobody";
      }
    
      var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    
      request(url, function(error, response, data) {
        if (!error && response.statusCode === 200) {
          var jsonData = JSON.parse(data);
    
          console.log("Title: " + jsonData.Title);
          console.log("Year: " + jsonData.Year);
          console.log("IMDB Rating: " + jsonData.imdbRating);
          console.log("Country: " + jsonData.Country);
          console.log("Language: " + jsonData.Language);
          console.log("Plot: " + jsonData.Plot);
          console.log("Actors: " + jsonData.Actors);
          console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
        }
      });
}

function doWhatISay(){
    fs.readFile("random.txt", "utf8", function(err, data){
        console.log(data); 
        var  dataArray = data.split(','); 
        if (dataArray.length === 1){
            liriCommand = dataArray[0]; 
        }

        if (dataArray.length == 2){
            liriCommand = dataArray[0]; 
            inputData = dataArray[1];

        }

        spotifyThisSong(inputData); 
    })

}


start(liriCommand); 