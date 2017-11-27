var express = require('express');
var router = express.Router();
var fs = require('fs');
var Combinatorics = require('js-combinatorics');

//Variables
var charSearch = "";
var wordLength = "";

//NANO
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var DESIGNNAME = "wordindexdutch";
var VIEWNAME = "wordindexdutch";
var nano = require('nano')('http://' + DBHOST + ":" + DBPORT);
var db = "genwoorddb";
var genwoorddb = nano.db.use('genwoorddb');

/* GET checkWoord page */
router.get('/', function(req, res, next) {

  //console logging
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('original URL:', fullUrl);
  console.log('query:',req.query);

  charSearch = req.query.charSearch;
  var lang = req.query.lang;
  wordLength = req.query.wordLength;


  //check input
  if (lang == "" || charSearch == "" || wordLength == ""){
    res.send('Error: (part of) input qeury empty');
    res.end();
    return;
  }

else {

    //split and sort the incoming characters
    var sortChars = charSearch.split("").sort(); //["a","b","c","d","e"]
    var charLen = sortChars.length;

    console.log("sortChars: ", sortChars);

    //create array for all combinations
    var tempArray = Combinatorics.combination(sortChars, wordLength).toArray();

    var combiArray = [];
    tempArray.forEach(function(combi){

      combiArray.push(combi.join(""));
    });

    console.log("combiArray: ",combiArray);

    getData(res, combiArray);

  }
});

//compare combiArray items to the database
function getData(routerRes, combiArray){

  genwoorddb.view(DESIGNNAME, VIEWNAME, {
    'keys': combiArray
  }, function(err, res) {
    if (!err) {
      var result = [];
      res.rows.forEach(function(doc) {
        result.push(doc.value);
        console.log('word found:',doc.value);
      });
      if (!res) {
        console.log('no word found.');
        res.send("no word found.");
      }
      if(result){
        // send back the result (array)
        console.log('end result: ',result);
        routerRes.send(result);
      }
    } else if (err) {
      console.log(err);
      routerRes.send(err);
    }
    routerRes.end();
  });
}

module.exports = router;
