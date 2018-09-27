const LightsView = require("../views/LightsView");

module.exports = class LightsController {

  constructor(behaviors){
    this.lights = behaviors.lights;
  }

  command(req, res) {
    let nodeId = req.params.nodeId;
    let command = req.params.cmd;
    this.lights.command(nodeId, command).then( function(){
      res.send("<h1>Success!</h1><br>v1" + nodeId + command);
    }, function(err){
      console.log(err);
      res.send("<h1>Failed :(</h1>");
    });
  }

  commandGroup(req, res){
    let groupId = req.params.groupId;
    let command = req.params.cmd;
    this.lights.commandGroup(groupId, command).then( function(){
      res.send(`<h1>Success!</h1><p>${groupId} | ${command}</p>`);
    }, function(err){
      console.log(err);
      res.send("<h1>Failed :(</h1>");
    });
  }

  website(req, res){
    res.send( LightsView() )
  }


};
