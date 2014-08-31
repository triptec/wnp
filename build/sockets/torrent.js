(function() {
  "use strict";
  module.exports = function(io) {
    var store, torrents, _;
    _ = require('lodash');
    store = require('./../store');
    torrents = require('./../controllers/torrents').torrents;
    return io.sockets.on("connection", function(socket) {
      socket.on("torrent_get", torrents.get);
      socket.on("torrent_pause", torrents.pause);
      socket.on("torrent_resume", torrents.resume);
      socket.on("torrent_select", torrents.select);
      socket.on("torrent_deselect", torrents.deselect);
    });
  };


  /*
    store.on "torrent", (infoHash, torrent) ->
      stats = ->
        swarm = torrent.swarm
        peers:
          total: swarm.wires.length
          unchocked: swarm.wires.reduce((prev, wire) ->
            prev + not wire.peerChoking
          , 0)
  
        traffic:
          down: swarm.downloaded
          up: swarm.uploaded
  
        speed:
          down: swarm.downloadSpeed()
          up: swarm.uploadSpeed()
  
        queue: swarm.queued
        paused: swarm.paused
      listen = ->
        notifyProgress = _.throttle(->
          io.sockets.emit "download", infoHash, progress(torrent.bitfield.buffer)  if torrent
          return
        , 1000)
        io.sockets.emit "verifying", infoHash, stats()
        torrent.once "ready", ->
          io.sockets.emit "ready", infoHash, stats()
          return
  
        torrent.on "uninterested", ->
          io.sockets.emit "uninterested", infoHash
          return
  
        torrent.on "interested", ->
          io.sockets.emit "interested", infoHash
          return
  
        interval = setInterval(->
          io.sockets.emit "stats", infoHash, stats()
          return
        , 1000)
        torrent.on "verify", notifyProgress
        torrent.once "destroyed", ->
          clearInterval interval
          io.sockets.emit "destroyed", infoHash
          torrent = null
          return
  
        return
      if torrent.torrent
        listen()
      else
        torrent.once "verifying", listen
      return
  
    return
   */

}).call(this);
