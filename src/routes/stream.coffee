app = require('./../app').app
path = require('path')
config = require('./../config')

# Torrent stream used by OMX player
app.get "/stream", (req, res) ->
  
