var http = require('http');
var request = require('sync-request');
var htmlToJson = require('html2json').html2json
var fs = require('fs');

var filenameLastHeader = "lastHeader.txt"

setInterval(function() {
  var res = request('GET', "http://fagutvalget.no/index.php");
  if (res.statusCode==200) {
    var html = res.getBody().toString()
    var json = htmlToJson(html)
    var topEvent = json.child[0].child[3].child[1].child[1].child[1].child[3].child[1].child[1].child[1].child[1].child[1]
    var header = topEvent.child[0].text
    var link = topEvent.attr.href

    if (fs.existsSync(filenameLastHeader)) {
      let lastHeader=fs.readFileSync(filenameLastHeader)
      if (lastHeader != header) {
        console.log("Alert! New header")
      }
    }

    console.log(header+": "+link)
    fs.writeFileSync(filenameLastHeader,header)
  } else {
    console.log("Got response: " + res.statusCode);
  }

}, 1*1000);
