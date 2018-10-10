var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config/config');
var webroutes = require('./controllers-web/web-routes');
var slackindex = require('./controllers-slack/slack-index');



console.log("=== ADDING ABILITIES");
var abilities = {
  isy:            new (require('./abilities/isy'))(config),
  slack:          new (require('./abilities/slack'))(config),
  ambientweather: new (require('./abilities/ambientweather'))(config),
  coolmasternet:  new (require('./abilities/coolmasternet'))(config)
};

console.log("=== ADDING BEHAVIORS");
var behaviors = {
  lights:                 new (require('./behavior/lights'))(config, abilities),
  banter:                 (require('./behavior/banter'))(config, abilities),
//  zwave:                  (require('./behavior/zwave'))(config, abilities),
//  ask_about_the_weather:  (require('./behavior/ask_about_the_weather'))(config, abilities),
  coolmasternet:          (require('./behavior/slack_control_coolmasternet'))(config, abilities)
};



console.log("= RUNNING!");


// Web Controllers
console.log("Setting Up Web Server");
var webserver = express();
// Parse request bodies
webserver.use(bodyParser.json());
webserver.use(bodyParser.urlencoded({ extended: true }));
// Setup a static directory 'public', totally optional
webserver.use(express.static('app/public'));
webroutes.forEach(function(route){
  let controller = new route.controller(behaviors)
  webserver.use(route.path, controller[route.handler].bind(controller));
});

webserver.on('error', console.log);
webserver.listen(config.webserver.port, function() {
  console.log('Express webserver configured and listening!');
});


// Slack Controllers
slackindex.initialize();
