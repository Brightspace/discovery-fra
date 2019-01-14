const os = require( 'os' );

(() => {
  return console.log(os.hostname().toLowerCase());
})();
