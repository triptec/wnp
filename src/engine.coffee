torrentStream = require('torrent-stream')
_             = require('lodash')
config        = require('./config')

module.exports = (torrent) ->
  options =
    tmp: config.tmp_path

  engine = torrentStream(torrent, options)

  engine.once 'ready', ->
    engine.torrent.ready = true

  engine.once 'destroyed', ->
    engine.removeAllListeners()

  return engine