// Static variables
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var DESIGNNAME = "wordindexdutch";
var VIEWNAME = "wordindexdutch";

var fs = require('fs');
var nano = require('nano')('http://' + DBHOST + ":" + DBPORT);

var db = "genwoorddb"
var genwoorddb = nano.db.use('genwoorddb');
var dicFile = './dics/dutch/OpenTaal-210G-flexievormen.txt';
var language = 'dutch'

//load dictionary file
fs.readFile(dicFile, "utf8", function(err, data){
  if(err) {
    console.log('error loading dictonary file', dicFile + "error:",err);
    return false;
  }

  console.log('File',dicFile + ' loaded!');

  // convert data to array
  var dicTextFile = data.split(/\r\n|\n/);

  console.log('dicTextFile length:',dicTextFile.length);

  //docArray = collection of include_docs
  var docArray = [];

  // do for each word in dicTextfile
  for (var i = 0; i < dicTextFile.length; i++) {
    var word = dicTextFile[i];

    //split, sort word
    var sortedWord = word.split("").sort().join("");

    //create doc
    var doc = {
      sortedword: sortedWord,
      word: word,
      language: language
    }
    docArray.push(doc);
  }

  //bulk upload to couchdb
  if (docArray.length > 0) {

    console.log('INFO - uploading docs..');
    genwoorddb.bulk({docs:docArray}, function(err, res){
      if (err) {
        console.log(err);
      } else {
        console.log('INFO - documents succesfully loaded.');
      }
    });
  } else {
    console.log('INFO - docArray empty, nothing to upload.');
  }
});
