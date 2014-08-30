(function() {
  var app, config, express, io, path, server;

  express = require('express');

  app = express();

  io = require('socket.io');

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

  io = io.listen(server);

  io.on("connection", function(socket) {
    socket.emit("news", {
      hello: "world"
    });
    socket.on("torrent", function(data) {
      console.log(data);
    });
  });

}).call(this);
