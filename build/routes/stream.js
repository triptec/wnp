(function() {
  var StreamController, SubtitleController, app;

  app = require('./../app').app;

  StreamController = require('./../controllers/stream');

  SubtitleController = require('./../controllers/subtitles').subtitles;

  app.all("/stream/:infoHash/:filepath", StreamController.all);

  app.all("/subtitle/:url", SubtitleController.stream);

}).call(this);
