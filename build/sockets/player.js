(function() {
  var os, player;

  os = require('os');

  if (os.arch() === 'arm6h') {
    player = require('./../omxctrl');
  }

  if (os.platform() === 'darwin') {
    player = require('./../vlcctrl');
  }

  module.exports = function(io) {
    return io.sockets.on("connection", function(socket) {
      socket.on("player_play", function(link) {
        console.log("playing: " + link);
        return player.play(link);
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
