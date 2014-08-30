# ==============================================
# Modules
# ==============================================
express = require('express')
app     = express()
path    = require('path')
config  = require('./config')

# ==============================================
# Server
# ==============================================
app.use('/assets/', express.static(config.wnpc.assets_path))

# Start server
server = app.listen(3000, ->
  console.log "Who needs popcorn!"
  console.log "Visit localhost:#{server.address().port}/wnpc"
)

io = require('socket.io').listen(server)

# ==============================================
# Exports
# ==============================================
module.exports = 
  app: app
  server: server
  io: io

# ==============================================
# Routes
# ==============================================
[
  "wnpc"
].forEach((route) ->
  require("./routes/#{route}")
)

io.on "connection", (socket) ->
  socket.on "torrent", (data) ->
    console.log data
    return
