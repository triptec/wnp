exec = require("child_process").exec
os = require("os")
EventEmitter = require("events").EventEmitter
util = require("util")
defaults = [" -f --video-on-top --extraintf lua"]
STATES =
  PLAYING: 0
  PAUSED: 1
  IDLE: 2

keys =
  decreaseSpeed: "slower\n"
  increaseSpeed: "faster\n"

#previousAudioStream: 'j',
#nextAudioStream: 'k',
  previousChapter: "chapter_p\n"
  nextChapter: "chapter_n\n"

#previousSubtitleStream: 'n',
#nextSubtitleStream: 'm',
#toggleSubtitles: 's',
#decreaseSubtitleDelay: 'd',
#increaseSubtitleDelay: 'f',
  pause: "pause\n" # toggle between pause and play
  stop: "stop\n"
  decreaseVolume: "voldown 10\n"
  increaseVolume: "volup 10\n"
  seekForward: "fastforward \n"


#seekBackward: "\x5b\x44",
#seekFastForward: "\x5b\x41",
#seekFastBackward: "\x5B\x42"
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
  playerPath = if os.platform() == 'darwin' then '/Applications/VLC.app/Contents/MacOS/VLC' else 'vlc'
  #We should check so that the player really exist.
  @player = exec(playerPath + " " + cmdOptions + " \"" + file + "\"")
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
  @player.kill('SIGKILL')

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