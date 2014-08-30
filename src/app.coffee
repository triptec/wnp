# ==============================================
# Modules
# ==============================================
express = require('express')
app     = express()
io      = require('socket.io')
path    = require('path')
config  = require('./config')

module.exports = app

# ==============================================
# Settings
# ==============================================


# ==============================================
# Routes
# ==============================================
[
  "wnpc"

].forEach((route) ->
  require("./routes/#{route}")
)

# ==============================================
# Server
# ==============================================
app.use('/assets/', express.static(config.wnpc.assets_path))

# Start server
server = app.listen(3000, ->
  console.log "Who needs popcorn!"
  console.log "Visit localhost:#{server.address().port}/wnpc"
)
io = io.listen(server)

io.on "connection", (socket) ->
  socket.emit "news",
    hello: "world"

  socket.on "torrent", (data) ->
    console.log data
    return

  return