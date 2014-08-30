(function() {
  var app, config, path;

  app = require('./../app').app;

  path = require('path');

  config = require('./../config');

  app.get("/wnpc", function(req, res) {
    return res.sendFile(config.wnpc.index_path);
  });

}).call(this);
