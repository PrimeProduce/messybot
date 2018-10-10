var LightsController = require('./LightsController');
var RooftopController = require('./RooftopController');


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
    path: '/roof/update',
    controller: RooftopController,
    handler: "update"
  },{
    path: '/roof',
    controller: RooftopController,
    handler: "website"
  }
];
