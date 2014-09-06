(function() {
  var config, fs, moment, schedule, _;

  schedule = require('node-schedule');

  fs = require('fs');

  config = require('./config');

  _ = require('lodash');

  moment = require('moment');

  module.exports = (function() {
    var rule;
    console.log("Starting vacuum cleaner");
    rule = new schedule.RecurrenceRule();
    rule.hour = 1;
    rule.minute = 0;
    rule.second = 0;
    return schedule.scheduleJob(rule, function() {
      console.log("Checking for old files...");
      return fs.readdir("" + config.tmp_path + "/torrent-stream", function(err, files) {
        return files.forEach(function(filename) {
          var diff, file;
          file = fs.statSync("" + config.tmp_path + "/torrent-stream/" + filename);
          diff = moment().diff(file.mtime);
          if (moment.duration(diff).get("days") > 1) {
            return console.log("remove file: " + filename);
          }
        });
      });
    });
  })();

}).call(this);
