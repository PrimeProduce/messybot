var Botkit = require('botkit');


class slack {

  constructor(config) {
   // CONNECT SLACK
    this.controller = Botkit.slackbot();
    this.bot = this.controller.spawn({
        token: config.slack.api_token
    });

		var self = this;
		this.controller.on('rtm_close', function(bot, err) {
			if (err) {
					console.log('Failed to start RTM')
					return setTimeout(self.start_rtm, 60000);
			}
      self.start_rtm();
		});

    this.start_rtm();
  }

	start_rtm() {
		var self = this;
    if( !this.bot ){
      return;
    }
    this.bot.startRTM(function(err,bot,payload) {
			if (err) {
					console.log('Failed to start RTM')
					return setTimeout(self.start_rtm, 60000);
			}
			console.log("RTM started!");
		});
	}

}

module.exports = slack;
