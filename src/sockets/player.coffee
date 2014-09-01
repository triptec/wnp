os = require('os')
if os.arch() == 'arm'
  player = require('./../omxctrl')
if os.platform() == 'darwin'
  player = require('./../vlcctrl')


module.exports = (io) ->
  io.sockets.on "connection", (socket) ->
    socket.on "player_play", (link)->
      console.log "playing: #{link}"
      player.play(link)
    socket.on "player_pause", ->
      console.log "pause"
      player.pause()
    socket.on "player_quit", ->
      console.log "quit"
      player.kill('SIGKILL')