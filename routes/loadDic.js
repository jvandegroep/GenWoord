var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET loadDic page */
router.get('/', function(req, res, next) {

  //console logging
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('original URL:', fullUrl);
  console.log('query:',req.query);

  // read file
  if (req.query.lang == '') {
    console.log("unknown dictionary file, please specify language");
    res.writeHead(400, {'Content-Type': 'text/html'});
    res.write("no dictionary file specified");
    res.end();
  } else {

    var dicFile = './bin/dics/dutch/OpenTaal-210G-basis-gekeurd.txt';

    fs.readFile(dicFile, "utf8", function(err, data){
      if(err) {
        console.log('error loading file', dicFile);
        res.writeHead(400, {'Content-Type': 'text/html'});
        res.write("error loading the file", dicFile);
        res.end();
      } else {

        console.log('File',dicFile + ' loaded!');

        // convert data to array
        var allTextLines = data.split(/\r\n|\n/);
        var libraryArray = [];

        for (var i=0; i<allTextLines.length; i++) {
          data = allTextLines[i].split(';');
          var tarr = [];

          for (var j=0; j<data.length; j++) {

            tarr.push(data[j].toUpperCase());
          }

        libraryArray.push(tarr);
        }

        // trow back the data that was read
        res.send(libraryArray);
        res.end();
      }
    });
  }


});

module.exports = router;
