# ==============================================
# Modules
# ==============================================
express = require('express')
app     = express()
path    = require('path')
config  = require('./config')
cors    = require('cors')
# ==============================================
# Server
# ==============================================
app.use('/assets/', express.static(config.wnpc.assets_path))
app.use(cors())
# Start server
server = app.listen(3000, ->
  console.log "Who needs popcorn!"
  console.log "Visit localhost:#{server.address().port}/wnpc"
)

io = require('socket.io').listen(server)
io.set 'log level', 2

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
  "api"
  "stream"
].forEach((route) ->
  require("./routes/#{route}")
)

# ==============================================
# Sockets
# ==============================================
[
  "torrent"
].forEach((socket_route) ->
  require("./sockets/#{socket_route}")(io)
)