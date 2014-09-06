# ==============================================
# Modules
# ==============================================
express = require('express')
app     = express()
path    = require('path')
config  = require('./config')
cors    = require('cors')
vacuum  = require('./vacuum')
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

ws = require('websocket.io')
ws_server = ws.attach(server)

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
  "player"
].forEach((socket_route) ->
  require("./sockets/#{socket_route}")(io)
)

ws_server.on('connection' , (client)->
        client.on('message', ()->
                console.log('ws on message:', arguments)
        )
        client.on('close', ()->
                console.log('ws on close', arguments)
        )
        client.on('error', ()->
                console.log('ws on error:', arguments)
        )
        client.send('Hello there my frined')
) 
