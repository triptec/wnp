(function() {
  var EventEmitter, STATES, defaults, exec, keys, method, omx, os, util, _fn;

  exec = require("child_process").exec;

  os = require("os");

  EventEmitter = require("events").EventEmitter;

  util = require("util");

  defaults = [" -f --video-on-top --extraintf lua"];

  STATES = {
    PLAYING: 0,
    PAUSED: 1,
    IDLE: 2
  };

  keys = {
    decreaseSpeed: "slower\n",
    increaseSpeed: "faster\n",
    previousChapter: "chapter_p\n",
    nextChapter: "chapter_n\n",
    pause: "pause\n",
    stop: "stop\n",
    decreaseVolume: "voldown 10\n",
    increaseVolume: "volup 10\n",
    seekForward: "fastforward \n"
  };

  omx = function() {
    if (!(this instanceof omx)) {
      return new omx();
    }
    this.state = STATES.IDLE;
  };

  util.inherits(omx, EventEmitter);

  omx.prototype.play = function(file, subtitle, opts) {
    if (subtitle) {
      opts = opts || defaults;
      opts.push("--sub-file=" + subtitle);
    }
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
    var cmdOptions, playerPath;
    cmdOptions = (opts || defaults).join(" ");
    console.log(cmdOptions);
    playerPath = os.platform() === 'darwin' ? '/Applications/VLC.app/Contents/MacOS/VLC' : 'vlc';
    this.player = exec(playerPath + " " + cmdOptions + " \"" + file + "\"");
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
    return this.player.kill('SIGKILL');
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
