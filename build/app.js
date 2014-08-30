(function() {
  var app, config, express, io, path, server;

  express = require('express');

  app = express();

  path = require('path');

  config = require('./config');

  app.use('/assets/', express["static"](config.wnpc.assets_path));

  server = app.listen(3000, function() {
    console.log("Who needs popcorn!");
    return console.log("Visit localhost:" + (server.address().port) + "/wnpc");
  });

  io = require('socket.io').listen(server);

  module.exports = {
    app: app,
    server: server,
    io: io
  };

  ["wnpc", "stream"].forEach(function(route) {
    return require("./routes/" + route);
  });

  io.on("connection", function(socket) {
    return console.log("new connection!");
  });

}).call(this);
