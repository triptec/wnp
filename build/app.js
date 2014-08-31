(function() {
  var app, config, cors, express, io, path, server;

  express = require('express');

  app = express();

  path = require('path');

  config = require('./config');

  cors = require('cors');

  app.use('/assets/', express["static"](config.wnpc.assets_path));

  app.use(cors());

  server = app.listen(3000, function() {
    console.log("Who needs popcorn!");
    return console.log("Visit localhost:" + (server.address().port) + "/wnpc");
  });

  io = require('socket.io').listen(server);

  io.set('log level', 2);

  module.exports = {
    app: app,
    server: server,
    io: io
  };

  ["wnpc", "api", "stream"].forEach(function(route) {
    return require("./routes/" + route);
  });

  ["torrent"].forEach(function(socket_route) {
    return require("./sockets/" + socket_route)(io);
  });

}).call(this);
