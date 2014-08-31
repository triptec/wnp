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
    @torrents[infoHash] = engine('magnet:?xt=urn:btih:' + infoHash)

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
      @torrents[infoHash] = engine(torrent) 
      @torrents[infoHash].once 'ready', =>
        done(null, @torrents[infoHash])
        @save()
    )

  save: () ->
    state = Object.keys(@torrents).map (infoHash)->
      infoHash

    fs.writeFileSync(config.storage.path, JSON.stringify(state), "utf8")

data = require(config.storage.path) || []
data.forEach (infoHash) ->
  store.load(infoHash)

module.exports = store