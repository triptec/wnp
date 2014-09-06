(function() {
  var app, config, cors, express, io, path, server, vacuum, ws, ws_server;

  express = require('express');

  app = express();

  path = require('path');

  config = require('./config');

  cors = require('cors');

  vacuum = require('./vacuum');

  app.use('/assets/', express["static"](config.wnpc.assets_path));

  app.use(cors());

  server = app.listen(3000, function() {
    console.log("Who needs popcorn!");
    return console.log("Visit localhost:" + (server.address().port) + "/wnpc");
  });

  io = require('socket.io').listen(server);

  ws = require('websocket.io');

  ws_server = ws.attach(server);

  module.exports = {
    app: app,
    server: server,
    io: io
  };

  ["wnpc", "api", "stream"].forEach(function(route) {
    return require("./routes/" + route);
  });

  ["torrent", "player"].forEach(function(socket_route) {
    return require("./sockets/" + socket_route)(io);
  });

  ws_server.on('connection', function(client) {
    client.on('message', function() {
      return console.log('ws on message:', arguments);
    });
    client.on('close', function() {
      return console.log('ws on close', arguments);
    });
    client.on('error', function() {
      return console.log('ws on error:', arguments);
    });
    return client.send('Hello there my frined');
  });

}).call(this);
