// Static variables
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var DBNAME = "genwoorddb";
var DESIGNNAME = "wordindexdutch";
var VIEWNAME = "wordindexdutch";

var fs = require('fs');
var nano = require('nano')('http://' + DBHOST + ":" + DBPORT);
var async = require('async');

var db = "genwoorddb"
var genwoorddb = nano.db.use('genwoorddb');
var dicFile = './dics/dutch/OpenTaal-210G-basis-gekeurd.txt';
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
  var docArray = []
  var i = 0;

  // do for each word in dicTextfile
  async.forEach(dicTextFile, function(word, docUploadBulk){

    //split, sort word
    var sortedWord = word.split("").sort().join("");

    //get sortedword from VIEW
    genwoorddb.view(DESIGNNAME, VIEWNAME, {
      'key': sortedWord,
      'include_docs': true
    }, function(err, res) {
      if (!err) {
        //check if doc exists
        if(res.rows.length > 0) {
          res.rows.forEach(function(doc){
            console.log(doc.value + ' already exists');
          })
          //if doc does not exist
        } else {
          //create doc
          var doc = {
            sortedword: sortedWord,
            word: word,
            language: language
          }

          //push doc to array
          docArray.push(doc);
        }
      }
    });
    docUploadBulk();
  });

  function docUploadBulk(){

    //bulk upload to couchdb
    if (docArray.length > 0) {

      console.log('INFOd - uploading docs..');
      genwoorddb.bulk({docs:docArray}, function(err, res){
        if (err) {
          console.log(err);
        } else {
          console.log('response:',res);
        }
      });
    } else {
      console.log('INFO - docArray empty, nothing to upload.');
    }
  }

});
