app = require('./../app')
path = require('path')
config = require('./../config')

app.get "/wnpc", (req, res) ->
  res.sendFile config.wnpc.index_path
