const firebase = require('firebase');
const fs = require('fs');

var config = {
  apiKey: "AIzaSyAHaFwzXQfOCzLRc61T7buHYtfMucIkwF8",
  authDomain: "myfields-researcher.firebaseapp.com",
  databaseURL: "https://myfields-researcher.firebaseio.com",
  projectId: "myfields-researcher",
  storageBucket: "myfields-researcher.appspot.com",
  messagingSenderId: "545497609582"
};
firebase.initializeApp(config);

var csv = require('node-csv').createParser();

function keyify(value) {
    return value.toLowerCase().replace(/\s+/g, '-')
}

fs.readFile('./scripts/seeds/pests.csv', 'utf-8', function(err, data) {
    if(err) return console.error(err);
    
    var lines = data.split('\r')
    console.log(lines);
    
    for(var i = 0; i < lines.length; i++) {
        var pest = lines[i].split(',');
        // 0 pest type 1 crop type 2 name
        firebase.database().ref('/crops').child(keyify(pest[1])).child(keyify(pest[0])).child(keyify(pest[2])).set({name: pest[2]});
    }

    
    
});
