

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}



module.exports = function(behaviors, controller) {
  var weather = behaviors.weather;
  controller.hears('weather',[
      'direct_message',
      'direct_mention',
      'mention'
    ], function(bot, message) {
      weather.update().then( function(d){
        var compass = degToCompass(d.winddir);
        var human_message = `Hi! The wind is blowing from ${compass} at ${d.windspeedmph}mph! Outside, it's ${d.tempf} degrees but feels like ${d.feelsLike.toFixed(2)} with a humidity of ${d.humidity}. Inside, it's ${d.tempinf} degrees. The solar radiation is ${d.solarradiation} and it's rained ${d.dailyrainin}in today so far. Hope you're having a nice day!`
        bot.reply(message, human_message);
      }, function(){
        bot.reply(message, "I couldn't find the weather. Sorry about that!");
      });
    }
  );
}
