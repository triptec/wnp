(function() {
  var StreamController, app;

  app = require('./../app').app;

  StreamController = require('./../controllers/stream');

  app.all("/stream/:torrentInfoHash/:filepath", StreamController.all);

}).call(this);
