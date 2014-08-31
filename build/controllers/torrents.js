(function() {
  var store, torrents;

  store = require('./../store');

  torrents = {
    get: function(link) {
      console.log("get " + link);
      return store.get(link, function(err, infoHash) {
        if (err) {
          console.log(err);
          return;
        }
        return console.log("GET IS DONE: ", infoHash);
      });
    },
    pause: function(infoHash) {
      var torrent;
      console.log("pausing " + infoHash);
      torrent = store.get(infoHash);
      if (torrent && torrent.swarm) {
        torrent.swarm.pause();
      }
    },
    resume: function(infoHash) {
      var torrent;
      console.log("resuming " + infoHash);
      torrent = store.get(infoHash);
      if (torrent && torrent.swarm) {
        torrent.swarm.resume();
      }
    },
    select: function(infoHash, file) {
      var torrent;
      console.log("selected " + infoHash + "/" + file);
      torrent = store.get(infoHash);
      if (torrent && torrent.files) {
        file = torrent.files[file];
        file.select();
        file.selected = true;
      }
    },
    deselect: function(infoHash, file) {
      var torrent;
      console.log("deselected " + infoHash + "/" + file);
      torrent = store.get(infoHash);
      if (torrent && torrent.files) {
        file = torrent.files[file];
        file.deselect();
        file.selected = false;
      }
    }
  };

  exports.torrents = torrents;

}).call(this);
