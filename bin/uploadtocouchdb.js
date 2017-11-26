//
//upload dic file words to couchdb as key and add sorted words as value
//
//

var fs = require('fs');
var Combinatorics = require('js-combinatorics');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Get DB data from url and send back data
function httpData(url,putData,res){
   var xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function() {
     if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 201)) {
          console.log("data received (200) from: ", url);
          res(xhttp.responseText);
        }
    if (xhttp.readyState == 4 && xhttp.status == 404) {
      console.log("connection failed, no response from URL:", url);
    }
  };
  xhttp.timeout = 2000; // time in milliseconds
  xhttp.ontimeout = function(e) {
    console.error("Timeout, cannot contact ", url);
    res("");
  };
  xhttp.onerror = function () {
    console.log("** An error occurred during the transaction");
    res("");
  };

  if (putData) {
    xhttp.open("PUT", url, "/json-handler");
    xhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhttp.send(putData);
    console.log('response from server: ',xhttp.responseText);
  } else {
    xhttp.open("GET", url, true);
    xhttp.send();
  }
}

// Static variables
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var DBNAME = "genwoorddb";
var DESIGNNAME = "wordindexdutch";
var DBURL = "http://" + DBHOST + ":" + DBPORT + "/" + DBNAME + "/_design/" + DESIGNNAME + "/_view/" + DESIGNNAME;
var DBURLSHORT = "http://" + DBHOST + ":" + DBPORT + "/" + DBNAME + "/";
var DBURLUUIDS = "http://" + DBHOST + ":" + DBPORT + "/_uuids";

// dutch dictionary file
var dicFile = './bin/dics/dutch/OpenTaal-210G-basis-gekeurd.txt';

//load dictionary file
fs.readFile(dicFile, "utf8", function(err, data){
  if(err) {
    console.log('error loading dictonary file', dicFile + "error:",err);
    return false;
  }

  console.log('File',dicFile + ' loaded!');

  // convert data to array
  var dicTextFile = data.split(/\r\n|\n/);

  // do for each word in dicTextfile
  dicTextFile.forEach(function(word){

    //split, sort word
    var sortedWord = word.split("").sort().join("");

    var swURL = DBURL + "?key=%22" + sortedWord + "%22&include_docs=true";

    // Connect to genwoorddb
    httpData(swURL, "", function(res){

      res = JSON.parse(res);

      //if document does not exist
      if (res.rows.length < 1){
        console.log('document with key',word + ' not found, creating a new doc');

        httpData(DBURLUUIDS, "", function(res2){

          var UUIDS = JSON.parse(res2).uuids;
          var newData = '{ "sortedword" : "' + sortedWord + '", "word" : "' + word + '", "language" : "dutch" }';

          var DBURLPUT = DBURLSHORT + UUIDS;

          httpData(DBURLPUT, newData, function(res3){

            if (err) {
              console.log('error creating doc, URL: ', createNewDocURL + 'data: ',newData);
              return;
            }
            console.log('document \"',word + "\" was created.");
            console.log('response from URL: ',DBURLPUT, res3 );
          });
        });


      } else {
        // document does exist
        console.log('document \"',word + "\" does already exist.");

      }
    });


  });

});
