const RooftopView = require("../views/RooftopView");

module.exports = class LightsController {

  constructor(behaviors){
    this.weather = behaviors.weather;
  }

  update(req, res) {
    this.weather.fetch().then( function(){
      res.send("TBD"); // do templating
    }, function(err){
      console.log(err);
      res.send("<h1>Failed :()</h1>");
    });
  }

  website(req, res){
    res.send( RooftopView() )
  }


};
