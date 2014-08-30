# ==============================================
# Modules
# ==============================================
express = require('express')
app     = express()
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
