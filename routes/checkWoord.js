var express = require('express');
var router = express.Router();
var fs = require('fs');

var charSearch = "";
var wordLength = "";

/* GET checkWoord page */
router.get('/', function(req, res, next) {

  //res.write("nog niet klaar");
  //res.end();

  //console logging
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('original URL:', fullUrl);
  console.log('query:',req.query);

  charSearch = req.query.charSearch;
  console.log("debug1 - charSearch: ", charSearch);
  var lang = req.query.lang;
  wordLength = req.query.wordLength;


  //check input
  if (lang == "" || charSearch == "" || wordLength == ""){
    res.send('Error: (part of) input qeury empty');
    res.end();
  }

  //check and assign language dictonary
  var dicFile;
  if (lang == 'dutch') {
      dicFile = './bin/dics/dutch/OpenTaal-210G-basis-gekeurd.txt';
  }

  //load dictionary file
  fs.readFile(dicFile, "utf8", function(err, data){
    if(err) {
      console.log('error loading dictonary file', dicFile);
      res.send("error loading dictonary file");
      res.end();
    }

    console.log('File',dicFile + ' loaded!');

    // convert data to array
    var dicTextFile = data.split(/\r\n|\n/);
    var libraryIndex = {};

    // do for each word in dicTextfile
    dicTextFile.forEach(function(word){

      //split, sort and set case of word to upper
      var sortedWord = word.toUpperCase().split("").sort().join("");

      //sorted word not present in libraryIndex
      if (! libraryIndex[sortedWord]){
        //add to libraryIndex with empty array
        libraryIndex[sortedWord]=[];
      }

      //push word to libraryIndex (sorted word as key)
      libraryIndex[sortedWord]=[word.toUpperCase()];

    });

    //split and sort the incoming characters
    console.log("debug2 - charSearch: ", charSearch)
    var sortChars = charSearch.split("").sort(); //"abcdef"
    var charLen = sortChars.length;

    console.log("sortChars: ", sortChars);
    console.log("charLen: ", charLen);

    //create array for all combinations
    var combiArray = [];

    for (i=0; i < charLen; i++){

      //remove the first element and add it to the end
      sortChars.push(sortChars.shift());

      tempArr = [];

      for (j=0; j < wordLength; j++) {

        tempArr.push(sortChars[j]);
      }

      combiArray.push(tempArr.sort().join(""));

    }

    console.log("combiArray: ",combiArray);

    // trow back the data that was read
    res.send('library filetje');
    res.end();

  });

});

module.exports = router;
