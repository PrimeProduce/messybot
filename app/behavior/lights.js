
const GROUPS = {
  "ZW_Kitchen_Cans": [
    "ZW026_1","ZW027_1"
  ],
 "ZW_1F_Fluorescent": [
   "16433"
 ]
}


module.exports = class Lights{

  constructor(config, abilities){
    this.isy = abilities.isy;
  }

  command(nodeId, cmd) {
    var path =  "/rest/nodes/" + nodeId + "/CMD/";
    if(cmd.toLowerCase() == "on") { path += "DON"; }
    if(cmd.toLowerCase() == "off") { path += "DOF"; }
    return new Promise( (resolve, reject) => {
      this.isy.request(path, function(err, json) {
        if(err) {
          reject();
        } else {
          //abilities.slack.bot.send({
           //channel: config.slack.channel_main,
           //text: "Someone turned " + nodeid + " " + cmd.toLowerCase() + "!"
           //});
           resolve();
         }
       });
    });
  }

  commandGroup(groupId, cmd){
    let group = GROUPS[groupId];
    if( group ){
      return Promise.all(group.map(nodeId => {
        return this.command(nodeId, cmd);
      }));
    }
  }
}
