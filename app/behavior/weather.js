

const MAX_DATA_POINTS = 60 * 1; // one hour trailing average
const FRICTIONAL_VELOCITY_FAKE_MULTIPLIER = 0.3;
const SENSOR_HEIGHT = 2; // meters
const MPH_TO_MPS = 0.447;
const BUCKET_COUNT = 24;


module.exports = class Weather{

  constructor(config, abilities){
    this.ambientweather = abilities.ambientweather;
    this.windDataIndex = 0;
    this.windSpeedsTop = [
      1,5,3,7,5,
      6,2,4,5,1,
      4,5,4,5,2,
      12,5,3,4,13,
      6,2,3,5,3
    ];
    this.windSpeedsBottom = [
      1,5,3,4,2,
      3,4,2,3,4,
      1,2,3,4,2,
      3,4,2,5,3,
      2,3,6,2,3
    ];
    this.windDirections = [
      21,32,54,34,34,
      76,45,35,54,43,
      53,72,45,36,45,
      87,98,67,34,67,
      75,35,42,86,45
    ];
    setInterval( this.compileData.bind(this), 60000 );
  }

  update(){
    return this.fetch().then( d => {
      d.windSpeedsTop = this.windSpeedsTop;
      d.windSpeedsBottom = this.windSpeedsBottom;
      d.windDirections = this.windDirections;
      return d;
    });
  }

  fetch(){
    return new Promise( (resolve, reject) => {
      this.ambientweather.get_weather_slow( (err, d) => {
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

  compileData(){
    // fetch from two instruments
    this.fetch().then( data => {
      this.windDataIndex = (this.windDataIndex === MAX_DATA_POINTS-1) ? 0 : this.windDataIndex+1;
      console.log("Compiled Data Index: " + this.windDataIndex);

      var ix = this.windDataIndex;
      this.windSpeedsTop[ix] = data.windspeedmph * MPH_TO_MPS;
      this.windSpeedsBottom[ix] = (data.windgustmph - data.windspeedmph) * MPH_TO_MPS;
      this.windDirections[ix] = data.winddir;
    }, function(err){
      console.error(err);
    });
  }

}
