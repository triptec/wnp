store = require('./../store')
module.exports = 
  all: (req, res) ->
    torrent = store.find('torrents', {torrentInfoHash: req.params.torrentInfoHash})
    unless torrent
      store.create('torrents', {torrentInfoHash: req.params.torrentInfoHash})
    res.send "Stream..."