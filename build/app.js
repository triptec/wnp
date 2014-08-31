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

  module.exports = {
    app: app,
    server: server,
    io: io
  };

  ["wnpc", "api", "stream"].forEach(function(route) {
    return require("./routes/" + route);
  });

  io.on("connection", function(socket) {
    return socket.on("torrent", function(data) {
      console.log(data);
    });
  });

}).call(this);
