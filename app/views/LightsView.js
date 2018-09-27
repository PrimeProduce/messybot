const wrapper = require('./wrapper.js');


module.exports = function(){
  return wrapper(
    `
    body{
      padding: 20px;
      font-family: 'sans-serif';
    }
    section{
      margin: 20px;
    }
    label{
      font-size: 24px;
      line-height 40px;
      font-weight: bold;
    }
    `,`
      function onChange1F(ev){
        var path;
        if( ev.target.checked ){
          path = '/lights/16433/on';
        } else {
          path = '/lights/16433/off';
        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener('load', function(){});
        oReq.open('GET', 'http://localhost:3000'+path);
        oReq.send();
      }
      document.getElementById("1F_Fluorescent").
        addEventListener("change", onChange1F);
    `,`
      <section>
        <label> Globe Lights </label>
        <input type="range" min="0" max="255"></input>
      </section>
      <section>
        <label> 1F Fluorescents </label>
        <input type="checkbox" id="1F_Fluorescent"></input>
      </section>
    `);
}
