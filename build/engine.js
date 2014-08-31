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
      return engine.torrent.ready = true;
    });
    engine.once('destroyed', function() {
      return engine.removeAllListeners();
    });
    return engine;
  };

}).call(this);
