(function() {
  var config, path;

  path = require('path');

  config = {
    wnpc: {
      index_path: path.normalize("" + __dirname + "/../node_modules/wnpc/dist/index.html"),
      assets_path: path.normalize("" + __dirname + "/../node_modules/wnpc/dist/assets")
    }
  };

  module.exports = config;

}).call(this);
