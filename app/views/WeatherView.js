const wrapper = require('./wrapper.js');


module.exports = function(d){
  return wrapper({
    style: `
      body{
        font-family: sans-serif;
      }
      #map, .overlay{
        position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
      }
      .overlay{
        padding: 8px 0;
      }
      .overlay p{
        padding: 12px 20px;
        background-color: rgba(0,0,0,0.5);
        color: white;
        font-size: 16px;
        font-weight: lighter;
        margin: 8px 0;
        float: left;
        clear: both;
      }
    `,
    headextra: `
      <script src='https://api.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.js'></script>
      <link href='https://api.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.css' rel='stylesheet' />
    `,
    loadscript: `
      var mapEl = document.getElementById('map');
      mapEl.style.width = document.documentElement.innerWidth;
      mapEl.style.height = document.documentElement.innerHeight;
      // this page is meant to be used in a fullscreen browser in the front of 424

      mapboxgl.accessToken = 'pk.eyJ1IjoibWllbmFpa29lIiwiYSI6ImNpZzZxMGNidjVtNDZ0NW0zd21xc20yMTEifQ.Yz9I2vVWcteSI_lBMgu2HA';
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 15,
        center: [-73.9883696, 40.7663304]
      });

      map.on('load', function () {
        // use weather data to model an absorption shape
      });

      setInterval( function(){
        var oReq = new XMLHttpRequest();
        oReq.addEventListener('load', function(ev){
          if( this.readyState = this.DONE ){
            var data = JSON.parse(this.response);
            document.getElementById("temp").innerText = data.tempf;
            document.getElementById("hum").innerText = data.humidity;
          }
        });
        oReq.open('GET', '/weather/update');
        oReq.send();
      }, 60000);
    `,
    body: `
      <div id='map'></div>
      <div class='overlay'>
        <p> Temperature:
          <b><span id='temp'>${d.tempf}</span>° F</b>
        </p>
        <p> Relative Humidity:
          <b><span id='hum'>${d.humidity}</span>%</b>
        </p>
      </div>
    `
  });
}
