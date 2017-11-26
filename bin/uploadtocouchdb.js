//
//upload dic file words to couchdb as key and add sorted words as value
//
//

var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//create web request
function httpData(url,cmd,postData,res){
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
     if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 201)) {
          //console.log("data received (200) from: " + DBHOST + " on port: " + DBPORT);
          res(xhttp.responseText);
        }
    if (xhttp.readyState == 4 && xhttp.status == 404) {
      console.log("connection failed, no response from URL:", url);
    }
  };
  xhttp.open(cmd, url, true);
  xhttp.timeout = 2000; // time in milliseconds
  xhttp.ontimeout = function(e) {
    console.error("Timeout, cannot contact ", url);
    res("");
  };
  xhttp.onerror = function () {
    console.log("** An error occurred during the transaction");
    res("");
  };
  if (postData) {
    xhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhttp.send(postData);
  } else {
    xhttp.send();
  }
}

// Static variables
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var DBNAME = "genwoorddb";
var DESIGNNAME = "wordindexdutch";
var DBURL = "http://" + DBHOST + ":" + DBPORT + "/" + DBNAME + "/_design/" + DESIGNNAME + "/_view/" + DESIGNNAME;
var dicFile = './dics/dutch/OpenTaal-210G-basis-gekeurd.txt';
// http://192.168.178.2:5984/genwoorddb/_design/wordindexdutch/_view/wordindexdutch?key=%22abl%22&include_docs=true

var testURL = DBURL + "?key=%22abl%22&include_docs=true";
// Connect to genwoorddb
httpData(testURL,"GET", "", function(res){

  console.log("DBURL = ", DBURL);
  console.log("ResultJSON = ",(JSON.parse(res)).rows);
});
