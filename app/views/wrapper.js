const htmlEncode = require('htmlencode').htmlEncode;

module.exports = function(style, script, body){
  return `<html>
    <head>
      <style type="text/css">
        ${ style }
      </style>
    </head>
    <body>
      ${ body }
      <script type="text/javascript">
        ${ script }
      </script>
    </body>
  </html>`;
}
