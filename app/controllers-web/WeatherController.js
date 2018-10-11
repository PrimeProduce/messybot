const WeatherView = require("../views/WeatherView");

module.exports = class WeatherController {

  constructor(behaviors){
    this.weather = behaviors.weather;
  }

  update(req, res) {
    return this.weather.update().then( function(d){
      res.json(d);
    }, function(err){
      console.log(err);
      res.json({});
    });
  }

  website(req, res){
    return this.weather.update().then( function(d){
      res.send( WeatherView(d) );
    });
  }


};
