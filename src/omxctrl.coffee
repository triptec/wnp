exec = require("child_process").exec
EventEmitter = require("events").EventEmitter
util = require("util")
defaults = ["-b -r -o hdmi"]
STATES =
  PLAYING: 0
  PAUSED: 1
  IDLE: 2

keys =
  decreaseSpeed: "1"
  increaseSpeed: "2"
  previousAudioStream: "j"
  nextAudioStream: "k"
  previousChapter: "i"
  nextChapter: "o"
  previousSubtitleStream: "n"
  nextSubtitleStream: "m"
  toggleSubtitles: "s"
  decreaseSubtitleDelay: "d"
  increaseSubtitleDelay: "f"
  pause: "p" # toggle between pause and play
  stop: "q"
  decreaseVolume: "-"
  increaseVolume: "+"
  seekForward: "[C"
  seekBackward: "[D"
  seekFastForward: "[A"
  seekFastBackward: "[B"

omx = ->
  return new omx()  unless this instanceof omx
  @state = STATES.IDLE
  return

util.inherits omx, EventEmitter

# start playing.. before make sure to
# shutdown any existing instance
omx::play = (file, opts) ->

  # toggle between play and pause if no file
  # was passed in.
  return @pause()  unless file

  # quit any existing instance
  @stop()
  return @init(file, opts)  if @state is STATES.IDLE

  # init asap
  @once "ended", (->
    @init file, opts
    return
  ).bind(this)
  return


# fire up omxplayer
omx::init = (file, opts) ->
  cmdOptions = (opts or defaults).join(" ")
  @player = exec("omxplayer " + cmdOptions + " \"" + file + "\"")
  @emit "playing", file
  @state = STATES.PLAYING
  @player.on "exit", (->
    @state = STATES.IDLE
    @player = null
    @emit "ended"
    return
  ).bind(this)
  return


# send a key command to omxplayer
omx::send = (key) ->
  return  if not @player or @state is STATES.IDLE
  @player.stdin.write key
  return


# check the current state
omx::getState = ->
  @state

omx::pause = ->
  return  if @state is STATES.IDLE
  @state = (if (@state is STATES.IDLE) then STATES.PLAYING else STATES.PAUSED)
  @send "p"
  return

omx::kill = ->
  @stop()

# build some nice methods for interacting
# with the player
for method of keys
  ((key) ->
    omx::[method] = ->
      @send key
      return

    return
  ) keys[method]
module.exports = omx()