(function() {
  var config, data, engine, fs, readTorrent, store, _;

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
      var e;
      if (!this.torrents[infoHash]) {
        e = engine('magnet:?xt=urn:btih:' + infoHash);
        return e.once('ready', (function(_this) {
          return function() {
            return _this.torrents[infoHash] = e;
          };
        })(this));
      }
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
          var e, infoHash;
          if (err) {
            return done(err);
          }
          infoHash = torrent.infoHash;
          if (_this.torrents[infoHash]) {
            done(null, _this.torrents[infoHash]);
            return;
          }
          e = engine(torrent);
          return e.once('ready', function() {
            _this.torrents[infoHash] = e;
            done(null, e);
            return _this.save();
          });
        };
      })(this));
    },
    save: function() {
      var state;
      state = _.keys(this.torrents);
      return fs.writeFileSync(config.storage.path, JSON.stringify(state), "utf8");
    }
  };

  data = require(config.storage.path) || [];

  data.forEach(function(infoHash) {
    return store.load(infoHash);
  });

  module.exports = store;

}).call(this);
