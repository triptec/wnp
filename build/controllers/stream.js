(function() {
  var store;

  store = require('./../store');

  module.exports = {
    all: function(req, res) {
      var torrent;
      torrent = store.find('torrents', {
        torrentInfoHash: req.params.torrentInfoHash
      });
      if (!torrent) {
        store.create('torrents', {
          torrentInfoHash: req.params.torrentInfoHash
        });
      }
      return res.send("Stream...");
    }
  };

}).call(this);
