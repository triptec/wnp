(function() {
  var config, fs, httpsync, os, player;

  os = require('os');

  httpsync = require('httpsync');

  fs = require('fs');

  config = require('../config');

  if (os.arch() === 'arm') {
    player = require('./../omxctrl');
  }

  if (os.platform() === 'darwin') {
    player = require('./../vlcctrl');
  }

  module.exports = function(io) {
    return io.sockets.on("connection", function(socket) {
      socket.on("player_play", function(obj) {
        var filename, subtitle, zip;
        console.log("playing: " + obj.link);
        console.log(obj);
        if (fs.exists("" + config.tmp_path + "/subtitle.srt")) {
          fs.unlinkSync("" + config.tmp_path + "/subtitle.srt");
        }
        if (obj.subtitle) {
          subtitle = httpsync.get("http://www.yifysubtitles.com" + obj.subtitle.url).end();
          zip = new require('node-zip')(subtitle.data, {
            base64: false,
            checkCRC32: true
          });
          filename = zip.files[Object.keys(zip.files)].name;
          fs.writeFileSync("" + config.tmp_path + "/subtitle.srt", zip.file(filename).asText());
        }
        return player.play(obj.link, "" + config.tmp_path + "/subtitle.srt");
      });
      socket.on("player_pause", function() {
        console.log("pause");
        return player.pause();
      });
      return socket.on("player_quit", function() {
        console.log("quit");
        return player.kill('SIGKILL');
      });
    });
  };

}).call(this);
