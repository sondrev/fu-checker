var http = require('http');
var request = require('sync-request');
var htmlToJson = require('html2json').html2json
var fs = require('fs');
var FCM = require('fcm-node')

var fcm = new FCM(process.env.fcm)

var filenameLastHeader = "./lastHeader"
var runEvery=60*1000; //in ms

var checkWebsite = function() {
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
        alert(header,link)

      }
    } else {
      console.log("No lastHeader-file")
      console.log('no file for last header. Is this the first run? '+__dirname)
    }

    fs.writeFileSync(filenameLastHeader,header)
  } else {
    console.log("Got response: " + res.statusCode);
  }
}


var alert = function(title,body) {
  console.log("Sending alert! "+title+" "+body)
  var message = {
    to: '/topics/all',
    notification: {
        title: title,
        body: body
    },
    data: {
        my_key: 'my value',
        my_another_key: 'my another value'
    }
}

  fcm.send(message, function(err, response){
      if (err) {
          console.log("Something has gone wrong!\n"+err)
      } else {
          console.log("Successfully sent with response: ", response)
      }
  })

}

console.log("Starting fu-checker")
checkWebsite();
setInterval(function() {
  checkWebsite();
}, runEvery);
