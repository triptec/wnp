os = require('os')
httpsync = require('httpsync')
fs = require('fs')
config = require('../config')
if os.arch() == 'arm'
  player = require('./../omxctrl')
if os.platform() == 'darwin'
  player = require('./../vlcctrl')


module.exports = (io) ->
  io.sockets.on "connection", (socket) ->
    socket.on "player_play", (obj)->
      console.log "playing: #{obj.link}"
      console.log obj
      if fs.exists("#{config.tmp_path}/subtitle.srt")
        fs.unlinkSync("#{config.tmp_path}/subtitle.srt")
      if obj.subtitle
        subtitle = httpsync.get("http://www.yifysubtitles.com#{obj.subtitle.url}").end()
        zip = new require('node-zip')(subtitle.data, {base64: false, checkCRC32: true})
        filename = zip.files[Object.keys(zip.files)].name
        fs.writeFileSync("#{config.tmp_path}/subtitle.srt",zip.file(filename).asText())
      player.play(obj.link, "#{config.tmp_path}/subtitle.srt")
    socket.on "player_pause", ->
      console.log "pause"
      player.pause()
    socket.on "player_quit", ->
      console.log "quit"
      player.kill('SIGKILL')
