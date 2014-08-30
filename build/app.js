(function() {
  var app, config, express, path, server;

  express = require('express');

  app = express();

  path = require('path');

  config = require('./config');

  module.exports = app;

  ["wnpc"].forEach(function(route) {
    return require("./routes/" + route);
  });

  app.use('/assets/', express["static"](config.wnpc.assets_path));

  server = app.listen(3000, function() {
    console.log("Who needs popcorn!");
    return console.log("Visit localhost:" + (server.address().port) + "/wnpc");
  });

}).call(this);
