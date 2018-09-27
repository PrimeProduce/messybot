var LightsController = require('./controllers-web/LightsController');


module.exports = [
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
  }
];
