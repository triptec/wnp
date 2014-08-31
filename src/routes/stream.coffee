app     = require('./../app').app
StreamController = require('./../controllers/stream')

app.all "/stream/:infoHash/:filepath", StreamController.all