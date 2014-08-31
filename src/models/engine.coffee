torrentStream = require('torrent-stream')
_             = require('lodash')

module.exports = (torrent, opts) ->
  engine = torrentStream(torrent, _.clone(opts, true))
  return engine