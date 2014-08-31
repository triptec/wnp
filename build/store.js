(function() {
  var config, fs, _;

  fs = require("fs");

  config = require('./config');

  _ = require('lodash');

  if (!fs.existsSync(config.storage.path)) {
    fs.writeFileSync(config.storage.path, JSON.stringify({
      torrents: []
    }), "utf8");
  }

  module.exports = {
    find: function(type, data) {
      var results, storage;
      storage = this.get_storage();
      results = _.where(storage[type], data);
      if (results.length > 0) {
        return results[0];
      } else {
        return false;
      }
    },
    create: function(type, data) {
      var storage;
      storage = this.get_storage();
      if (storage[type]) {
        storage[type].push(data);
        return this.save(storage);
      } else {
        return console.log("" + type + " type doesn't exist");
      }
    },
    save: function(storage) {
      return fs.writeFileSync(config.storage.path, JSON.stringify(storage), "utf8");
    },
    get_storage: function() {
      return require(config.storage.path);
    }
  };

}).call(this);
