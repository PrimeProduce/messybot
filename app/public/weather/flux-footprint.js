
var FOOTPRINT_BUCKET_COUNT = 24;
var FOOTPRINT_DIVIDER = 360 / FOOTPRINT_BUCKET_COUNT;
var VON_KARMAN = 0.41;
var ROUGHNESS_LENGTH = 1; // meters   https://en.wikipedia.org/wiki/Roughness_length
var FRICTIONAL_VELOCITY_FAKE_MULTIPLIER = 0.3;
var HEIGHT_BOTTOM = 2; // meters
var HEIGHT_TOP = 30; // meters
var EARTH_RADIUS = 6378000 // meters
var EARTH_RADIANS_PER_METER = 1 / EARTH_RADIUS;
var DEG_TO_RAD = Math.PI / 180;
var TWO_PI = Math.PI * 2;
var HALF_PI = Math.PI / 2;
var PRIME_PRODUCE_LAT_LON = [-73.9883696, 40.7663304];
var FOOTPRINT_COLORS = ["#33F","#66F","#99F"];


function footprintFromSeries(windSpeedsTop, windSpeedsBottom, directions){
  var windBuckets = [];
  for( var ix=0; ix<FOOTPRINT_BUCKET_COUNT; ix++ ){
    windBuckets[ix] = {sumTop: 0, sumBottom: 0, length: 0};
  }
  for( var ix=0; ix<windSpeedsTop.length; ix++ ){
    // assumes speeds and directions have same length
    var bucket = windBuckets[directions[ix] % FOOTPRINT_DIVIDER];
    bucket.sumTop += windSpeedsTop[ix];
    bucket.sumBottom += windSpeedsBottom[ix];
    bucket.length += 1;
  }

  var footprint = [[],[],[]]; // one for each percentage

  windBuckets.forEach( function(bucket, ix){
    if( bucket.length === 0 ){
      footprint[2].push( [0,0] );
      footprint[1].push( [0,0] );
      footprint[0].push( [0,0] );
      return;
    }

    var averageSpeedTop = bucket.sumTop / bucket.length;
    if( averageSpeedTop === 0 ){
      footprint[2].push( [0,0] );
      footprint[1].push( [0,0] );
      footprint[0].push( [0,0] );
      return;
    }
    var averageSpeedBottom = bucket.sumBottom / bucket.length;

    // https://en.wikipedia.org/wiki/Shear_velocity
    var shearVelocity =
      (VON_KARMAN * (averageSpeedTop - averageSpeedBottom)) /
      Math.log(HEIGHT_TOP / HEIGHT_BOTTOM);
    if( shearVelocity === 0 ){
      footprint[2].push( [0,0] );
      footprint[1].push( [0,0] );
      footprint[0].push( [0,0] );
      return;
    }

    // Schuepp 1990 (6)
    var bigU = (shearVelocity * Math.log((HEIGHT_TOP/ROUGHNESS_LENGTH) - 1 + (ROUGHNESS_LENGTH / HEIGHT_TOP))) /
      (VON_KARMAN * (1 - (ROUGHNESS_LENGTH / HEIGHT_TOP)));

    // Schuepp 1990 (9)
    //   Using A = (U(z-d) / u*k) which is used in both the linear coefficient and the exponential coefficient
    var coeff = (bigU * HEIGHT_TOP) / (shearVelocity * VON_KARMAN);

    // Schuepp 1990 (13)
    var cumulative = Math.exp(coeff / 10000); // range shouldn't exceed 10km


    var bucketRadians = (((FOOTPRINT_DIVIDER * (ix + 0.5)) * DEG_TO_RAD) + (HALF_PI)) % (TWO_PI);
    var directionVectorX = -Math.cos(bucketRadians) * coeff * EARTH_RADIANS_PER_METER;
    var directionVectorY = -Math.sin(bucketRadians) * coeff * EARTH_RADIANS_PER_METER;

    // this gives diff in lat/lon
    var lnc050 = Math.log(cumulative * 0.5);
    footprint[2].push([
      directionVectorX / lnc050,
      directionVectorY / lnc050
    ]);
    var lnc075 = Math.log(cumulative * 0.75);
    footprint[1].push([
      directionVectorX / lnc075,
      directionVectorY / lnc075
    ]);
    var lnc090 = Math.log(cumulative * 0.9);
    footprint[0].push([
      directionVectorX / lnc090,
      directionVectorY / lnc090
    ]);
  });

  return footprint;
}



var FluxFootprint = {

  initialize: function( mapId ){
    var mapEl = document.getElementById( mapId );
    mapEl.style.width = document.documentElement.innerWidth;
    mapEl.style.height = document.documentElement.innerHeight;
    // this page is meant to be used in a fullscreen browser in the front of 424

    // setup map
    mapboxgl.accessToken = 'pk.eyJ1IjoibWllbmFpa29lIiwiYSI6ImNpZzZxMGNidjVtNDZ0NW0zd21xc20yMTEifQ.Yz9I2vVWcteSI_lBMgu2HA';
    this.map = new mapboxgl.Map({
      container: mapId,
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 16,
      center: PRIME_PRODUCE_LAT_LON
    });

    this.map.on('load', function () {
      for( var ix=0; ix < FOOTPRINT_COLORS.length; ix++ ){
        this.map.addLayer({
          'id': `footprint-${ix}`,
          'type': 'fill',
          'source': {
              'type': 'geojson',
              'data': {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Polygon',
                      'coordinates': [
                        [
                          [0,0]
                        ]
                      ]
                  }
              }
          },
          'layout': {},
          'paint': {
              'fill-color': FOOTPRINT_COLORS[ix],
              'fill-opacity': 0.8
          }
        });
      }

      this.fetchUpdate();
      setInterval( this.fetchUpdate.bind(this), 60000);
    }.bind(this));
  },

  fetchUpdate: function(){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener('load', function(ev){
      if( this.readyState === this.DONE ){
        var data = JSON.parse(this.response);
        FluxFootprint.handleUpdate(data);
      }
    });
    oReq.open('GET', '/weather/update');
    oReq.send();
  },

  handleUpdate: function(data){
    document.getElementById("temp").innerText = data.tempf;
    document.getElementById("hum").innerText = data.humidity;
    var footprint = footprintFromSeries(data.windSpeedsTop, data.windSpeedsBottom, data.windDirections);
    for( let ix=footprint.length-1; ix>0; ix-- ){
      this.drawFootprint(footprint[ix], ix);
    }
  },

  drawFootprint: function(footprintSet, index){
    var coordinates = footprintSet.map( function(bucket){
      return [
        PRIME_PRODUCE_LAT_LON[0] + bucket[0],
        PRIME_PRODUCE_LAT_LON[1] + bucket[1]
      ];
    });

    coordinates.push(coordinates[0]); // geojson requires that polygons have the same start and end coordinates

    var source = this.map.getSource(`footprint-${index}`);

    source.setData({
        'type': 'Feature',
        'properties': {
          'name': `footprint-${index}`
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
              coordinates
            ]
        }
    });
  }
}
