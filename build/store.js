(function() {
  var config, engine, fs, readTorrent, store, _;

  fs = require("fs");

  config = require('./config');

  _ = require('lodash');

  engine = require('./engine');

  readTorrent = require('read-torrent');

  if (!fs.existsSync(config.storage.path)) {
    fs.writeFileSync(config.storage.path, JSON.stringify([]), "utf8");
  }

  store = {
    torrents: {},
    load: function(infoHash) {
      return this.torrents[infoHash] = engine('magnet:?xt=urn:btih:' + infoHash);
    },
    find: function(infoHash) {
      if (this.torrents[infoHash]) {
        return this.torrents[infoHash];
      } else {
        return false;
      }
    },
    get: function(link, done) {
      return readTorrent(link, (function(_this) {
        return function(err, torrent) {
          var infoHash;
          if (err) {
            return done(err);
          }
          infoHash = torrent.infoHash;
          if (_this.torrents[infoHash]) {
            return _this.torrents[infoHash];
          }
          _this.torrents[infoHash] = engine(torrent);
          return _this.torrents[infoHash].once('ready', function() {
            done(null, infoHash);
            return _this.save();
          });
        };
      })(this));
    },
    save: function() {
      var state;
      state = Object.keys(this.torrents).map(function(infoHash) {
        return infoHash;
      });
      return fs.writeFileSync(config.storage.path, JSON.stringify(state), "utf8");
    }
  };

  require(config.storage.path).forEach(function(infoHash) {
    return store.load(infoHash);
  });

  module.exports = store;

}).call(this);
