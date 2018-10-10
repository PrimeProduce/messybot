const wrapper = require('./wrapper.js');


module.exports = function(d){
  return wrapper(
    `
    body{
      font-family: 'sans-serif';
    }
    #map, .overlay{
      position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .overlay p{
      padding: 20px 40px;
      background-color: rgba(0,0,0,0.5);
      color: white;
      font-size: 20px;
      font-weight: light;
    }
    `,`
    `,`
      <div id='map'></div>
      <div class='overlay'>
        <p> Outside Temperature: <b>${d.tempinf}</b></p>
      </div>
      <script type='text/javascript' src='mapbox' />
    `);
}
