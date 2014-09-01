store = require('./../store')
torrents =
  get: (link, socket) ->
    console.log "get #{link}"
    store.get link, (err, torrent) ->
      if err
        console.log err
        return
      console.log "Emitting on #{torrent.infoHash}"
      socket.emit(torrent.infoHash, torrent.torrent)
      console.log "GET IS DONE: ", torrent.infoHash

  pause: (infoHash) ->
    console.log "pausing " + infoHash
    torrent = store.find(infoHash)
    torrent.swarm.pause()  if torrent and torrent.swarm
    return
  resume: (infoHash) ->
    console.log "resuming " + infoHash
    torrent = store.find(infoHash)
    torrent.swarm.resume()  if torrent and torrent.swarm
    return

  select: (infoHash, file) ->
    console.log "selected " + infoHash + "/" + file
    torrent = store.find(infoHash)
    if torrent and torrent.files
      file = torrent.files[file]
      file.select()
      file.selected = true
    return

  deselect: (infoHash, file) ->
    console.log "deselected " + infoHash + "/" + file
    torrent = store.find(infoHash)
    if torrent and torrent.files
      file = torrent.files[file]
      file.deselect()
      file.selected = false
    return

exports.torrents = torrents