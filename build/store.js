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
    data: require('./../store.json'),
    find: function(type, attrs) {
      var results;
      results = _.where(this.data[type], attrs);
      if (results.length > 0) {
        return results[0];
      } else {
        return false;
      }
    },
    create: function(type, attrs) {
      this.data[type].push(attrs);
      return this.save();
    },
    save: function() {
      return fs.writeFile(config.storage.path, JSON.stringify(this.data), "utf8");
    }
  };

}).call(this);
