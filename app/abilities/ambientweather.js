var request = require("request");

class ambientweather {

  constructor(config) {
    this.config = config;
    this.apiurl = "https://api.ambientweather.net/v1/devices/" + config.ambientweather.mac + "?apiKey=" + config.ambientweather.apikey + "&applicationKey=" + config.ambientweather.appkey;
  }

  get_weather_slow(cb) {
    request(this.apiurl, (err, resp, body) => {
      cb(err, JSON.parse(body)[0]);
    });
  }

  /* TODO: use realtime api */


}

module.exports = ambientweather;
