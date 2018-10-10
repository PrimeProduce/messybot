var LightsController = require('./LightsController');
var WeatherController = require('./WeatherController');


module.exports = [
  // First Floor Lights
  {
    path: '/lights/group/:groupId/:cmd',
    controller: LightsController,
    handler: "commandGroup"
  },{
    path: '/lights/:nodeId/:cmd',
    controller: LightsController,
    handler: "command"
  },{
    path: '/lights',
    controller: LightsController,
    handler: "website"
  },

  // Roof
  {
    path: '/weather/update',
    controller: WeatherController,
    handler: "update"
  },{
    path: '/weather',
    controller: WeatherController,
    handler: "website"
  }
];
