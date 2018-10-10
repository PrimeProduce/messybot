const WeatherView = require("../views/WeatherView");

module.exports = class WeatherController {

  constructor(behaviors){
    this.weather = behaviors.weather;
  }

  update(req, res) {
    this.weather.update().then( function(d){
      res.json(d);
    }, function(err){
      console.log(err);
      res.send("<h1>Failed :(</h1>");
    });
  }

  website(req, res){
    res.send( WeatherView(d) );
  }


};
