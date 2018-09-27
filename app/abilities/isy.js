var request = require('request');
var xml2js = require("xml2js");

class isy {
  constructor(config) {
    this.protocol = config.isy.protocol;
    this.addr = config.isy.addr;
    this.port = config.isy.port;
    this.user = config.isy.user;
    this.pass = config.isy.pass;
  }

  request(path, callback) {
    var url = this.protocol + '://' + this.user + ":" + this.pass + "@"  + this.addr + ":" + this.port;
    request({
      url: url + path,
    }, function (error, response, body) {
      if( response ){
        if (response.statusCode == 200) {
          xml2js.parseString(body, function (err, json) {
            callback(false, json);
          });
        } else if( response.statusCode == 404) {
          console.error("404 Not Found: "+url+path)
          callback(true, {});
        } else {
          console.error("Unhandled Response Code: "+response.statusCode);
          callback(true, {});
        }
      } else if(error){
        console.error(error);
        callback(true, {});
      } else {
        console.error("No Response, No Error");
        callback(true, {});
      }
    });
  }

}

module.exports = isy;
