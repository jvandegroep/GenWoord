// Static variables
var DBHOST = "127.0.0.1";
var DBPORT = "5984";
var DESIGNNAME = "_design/wordindexdutch";

var fs = require('fs');
var nano = require('nano')('http://' + DBHOST + ":" + DBPORT);

var dbName = "genwoorddb";
var dicDir = './dics/dutch/';
var language = 'dutch';

//set database variable
const genwoorddb = nano.db.use(dbName);


//Creat database if not exists
function createDatabase() {

  nano.db.get(dbName, function(err, res) {
    if (err){
      console.log('datatabase',dbName + ' does not exist, creating..');

      //creating datatabase
      nano.db.create(dbName, function(err, res){
        if(!err) {

          console.log(res);
          createDesignView();
        } else {

          console.log(err);
          process.exit(1);
        }
      });

    } else {
      console.log('database',dbName + ' already exists.');
      createDesignView();
    }
  });
}


function createDesignView(){

  //create design document and view
  genwoorddb.get(DESIGNNAME, function(err, res){
    if(err){
      console.log('Design document not in database, creating design and view doc..');

      genwoorddb.insert(
        { "views":
          { "sortedword" :
            { "map": function(doc){ emit(doc.sortedword, doc.word); } }
          }
        }, DESIGNNAME, function (err, res) {
          if (!err) {
            console.log('Design doc created.');
            importDocs();
          } else {
            console.log(err);
            process.exit(1);
          }
        });
    } else {
      console.log('Design document is already in the database.');
      importDocs();
    }
  });
}


//load dictionary file
function importDocs() {

  var dicFiles = [];

  fs.readdirSync(dicDir).forEach( function(file) {
    if (file.indexOf('.txt') >= 0) {
      dicFiles.push(file);
    }
  });

  for (var i = 0; i < dicFiles.length; i++) {

    fs.readFile(dicDir+dicFiles[i], "utf8", function(err, data){
      if(err) {
        console.log('error loading dictonary file error:',err);
        return false;
      }

      console.log('File loaded!');

      // convert data to array
      var dicTextFile = data.split(/\r\n|\n/);

      console.log('Dictornary word count:',dicTextFile.length);

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
        };
        docArray.push(doc);
      }

      //bulk upload to couchdb
      if (docArray.length > 0) {

        console.log('INFO - uploading docs.');
        genwoorddb.bulk({docs:docArray}, function(err, res){
          if (err) {
            console.log(err);
          } else {
            console.log('INFO - documents succesfully uploaded to the database.');
          }
        });
      } else {
        console.log('INFO - docArray empty, nothing to upload.');
      }
    });
  }
  }

createDatabase();
