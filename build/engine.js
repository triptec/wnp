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
    engine.once('destroyed', function() {
      engine.removeAllListeners();
      return console.log("Engine destroyed!");
    });
    return engine;
  };

}).call(this);
