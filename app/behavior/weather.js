
module.exports = class Weather{

  constructor(config, abilities){
    this.ambientweather = abilities.ambientweather;
  }

  update(){
    return new Promise( function(resolve, reject){
      this.ambientweather.get_weather_slow( function(err, d){
        if( err ){
          reject(err);
        } else if( d ){
          resolve(d);
        } else {
          reject("No Response");
        }
      });
    });
  }
}
