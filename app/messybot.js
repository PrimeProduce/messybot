var config = require('./config/config');




console.log("=== ADDING ABILITIES");
var abilities = {};

console.log("= connect to ISY");
abilities.isy = new (require('./abilities/isy'))(config);

console.log("= connect to SLACK");
abilities.slack = new (require('./abilities/slack'))(config);

//console.log("= connect to DMX");
//abilities.dmx = new (require('./abilities/dmx'))(config);

console.log("= start webserver");
abilities.webserver = new (require('./abilities/webserver'))(config);

console.log("= start ambientweather");
abilities.ambientweather = new (require('./abilities/ambientweather'))(config);

console.log("= start coolmasternet");
abilities.coolmasternet = new (require('./abilities/coolmasternet'))(config);




console.log("=== ADDING BEHAVIORS");

console.log("= adding banter - general slack convo");
(require('./behavior/banter'))(config, abilities);

console.log("= adding zwave - controlling zwave nodes with Slack messages");
(require('./behavior/zwave'))(config, abilities);

console.log("= adding qrswitches - the ability to use scanned QR codes/urls to activate light switches");
(require('./behavior/qrswitches'))(config, abilities);

console.log("= adding ask_about_the_weather");
(require('./behavior/ask_about_the_weather'))(config, abilities);

(require('./behavior/slack_control_coolmasternet'))(config, abilities);

console.log("= RUNNING!");
