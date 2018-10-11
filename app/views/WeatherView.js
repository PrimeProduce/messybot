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
      <script src='/public/weather/flux-footprint.js'></script>
    `,
    loadscript: `
      FluxFootprint.initialize('map');
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
