const htmlEncode = require('htmlencode').htmlEncode;

module.exports = function(pieces){
  return `<html>
    <head>
      <style type="text/css">
        ${ pieces.style || '' }
      </style>
      ${ pieces.headextra || '' }
    </head>
    <body>
      ${ pieces.body || '' }
      <script type="text/javascript">
        window.onload = function(){
          ${ pieces.loadscript || '' }
        };
      </script>
    </body>
  </html>`;
}
