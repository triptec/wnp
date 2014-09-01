(function() {
  var EventEmitter, STATES, defaults, exec, keys, method, omx, util, _fn;

  exec = require("child_process").exec;

  EventEmitter = require("events").EventEmitter;

  util = require("util");

  defaults = ["-b -r -o hdmi"];

  STATES = {
    PLAYING: 0,
    PAUSED: 1,
    IDLE: 2
  };

  keys = {
    decreaseSpeed: "1",
    increaseSpeed: "2",
    previousAudioStream: "j",
    nextAudioStream: "k",
    previousChapter: "i",
    nextChapter: "o",
    previousSubtitleStream: "n",
    nextSubtitleStream: "m",
    toggleSubtitles: "s",
    decreaseSubtitleDelay: "d",
    increaseSubtitleDelay: "f",
    pause: "p",
    stop: "q",
    decreaseVolume: "-",
    increaseVolume: "+",
    seekForward: "[C",
    seekBackward: "[D",
    seekFastForward: "[A",
    seekFastBackward: "[B"
  };

  omx = function() {
    if (!(this instanceof omx)) {
      return new omx();
    }
    this.state = STATES.IDLE;
  };

  util.inherits(omx, EventEmitter);

  omx.prototype.play = function(file, opts) {
    if (!file) {
      return this.pause();
    }
    this.stop();
    if (this.state === STATES.IDLE) {
      return this.init(file, opts);
    }
    this.once("ended", (function() {
      this.init(file, opts);
    }).bind(this));
  };

  omx.prototype.init = function(file, opts) {
    var cmdOptions;
    cmdOptions = (opts || defaults).join(" ");
    this.player = exec("omxplayer " + cmdOptions + " \"" + file + "\"");
    this.emit("playing", file);
    this.state = STATES.PLAYING;
    this.player.on("exit", (function() {
      this.state = STATES.IDLE;
      this.player = null;
      this.emit("ended");
    }).bind(this));
  };

  omx.prototype.send = function(key) {
    if (!this.player || this.state === STATES.IDLE) {
      return;
    }
    this.player.stdin.write(key);
  };

  omx.prototype.getState = function() {
    return this.state;
  };

  omx.prototype.pause = function() {
    if (this.state === STATES.IDLE) {
      return;
    }
    this.state = (this.state === STATES.IDLE ? STATES.PLAYING : STATES.PAUSED);
    this.send("p");
  };

  omx.prototype.kill = function() {
    return this.player.stop();
  };

  _fn = function(key) {
    omx.prototype[method] = function() {
      this.send(key);
    };
  };
  for (method in keys) {
    _fn(keys[method]);
  }

  module.exports = omx();

}).call(this);
