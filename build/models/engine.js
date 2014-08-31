(function() {
  var torrentStream, _;

  torrentStream = require('torrent-stream');

  _ = require('lodash');

  module.exports = function(torrent, opts) {
    var engine;
    engine = torrentStream(torrent, _.clone(opts, true));
    return engine;
  };

}).call(this);
