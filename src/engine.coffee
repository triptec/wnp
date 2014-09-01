torrentStream = require('torrent-stream')
_             = require('lodash')
config        = require('./config')

module.exports = (torrent) ->
  options =
    tmp: config.tmp_path

  engine = torrentStream(torrent, options)

  engine.once 'ready', ->
    console.log "Torrent ready: #{engine.infoHash}"

  engine.once 'verifying', ->
    console.log("verifying: #{engine.infoHash}");

  engine.once 'destroyed', ->
    engine.removeAllListeners()
    console.log "Engine destroyed!"

  engine.on 'uninterested', ->
    console.log("Uninterested: #{engine.infoHash}")

  engine.on 'interested', ->
    console.log("Interested: #{engine.infoHash}")

  engine.on 'error', (err) ->
    console.log("Error #{engine.infoHash}: #{err}")

  return engine