var WeatherController = require("./WeatherController");


module.exports = function(behaviors, slackAbility){
  WeatherController(behaviors, slackAbility.controller);
}
