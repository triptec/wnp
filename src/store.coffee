fs     = require("fs")
config = require('./config')
_      = require('lodash')
engine = require('./engine')
readTorrent = require('read-torrent')

# Check if storage exist, otherwise create it
unless fs.existsSync(config.storage.path)
  fs.writeFileSync(config.storage.path, JSON.stringify([]), "utf8")

store =
  torrents: {}

  load: (infoHash) ->
    unless @torrents[infoHash]
      e = engine('magnet:?xt=urn:btih:' + infoHash)
      e.once 'ready', =>
        @torrents[infoHash] = e

  find: (infoHash) ->
    if @torrents[infoHash]
      return @torrents[infoHash] 
    else
      return false

  get: (link, done) ->
    readTorrent(link, (err, torrent) =>
      if err
        return done(err)
      infoHash = torrent.infoHash
      if @torrents[infoHash]
        done(null, @torrents[infoHash])
        return
      
      e = engine(torrent)
      e.once 'ready', =>
        @torrents[infoHash] = e
        done(null, e)
        @save()
    )

  save: () ->
    state = _.keys(@torrents)
    fs.writeFileSync(config.storage.path, JSON.stringify(state), "utf8")

data = require(config.storage.path) || []
data.forEach (infoHash) ->
  store.load(infoHash)

module.exports = store