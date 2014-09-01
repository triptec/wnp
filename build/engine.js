(function() {
  var config, torrentStream, _;

  torrentStream = require('torrent-stream');

  _ = require('lodash');

  config = require('./config');

  module.exports = function(torrent) {
    var engine, options;
    options = {
      tmp: config.tmp_path
    };
    engine = torrentStream(torrent, options);
    engine.once('ready', function() {
      return console.log("Torrent ready: " + engine.infoHash);
    });
    engine.once('verifying', function() {
      return console.log("verifying: " + engine.infoHash);
    });
    engine.once('destroyed', function() {
      engine.removeAllListeners();
      return console.log("Engine destroyed!");
    });
    engine.on('uninterested', function() {
      return console.log("Uninterested: " + engine.infoHash);
    });
    engine.on('interested', function() {
      return console.log("Interested: " + engine.infoHash);
    });
    engine.on('error', function(err) {
      return console.log("Error " + engine.infoHash + ": " + err);
    });
    return engine;
  };

}).call(this);
