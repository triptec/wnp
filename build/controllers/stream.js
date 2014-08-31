(function() {
  var mime, rangeParser, store, _;

  store = require('./../store');

  rangeParser = require('range-parser');

  _ = require('lodash');

  mime = require('mime');

  module.exports = {
    all: function(req, res) {
      var engine, file, filepath, infoHash, range;
      if (!(req.params.infoHash && req.params.filepath)) {
        console.log("Error: missing one of infoHash: " + req.params.infoHash + " and filepath: " + req.params.filepath);
        res.status(403).end();
        return;
      }
      infoHash = req.params.infoHash.toLowerCase();
      filepath = req.params.filepath;
      engine = store.find(infoHash);
      if (!engine) {
        console.log("Error: Couldn't find torrent with infoHash: " + infoHash + " and filepath: " + filepath);
        res.status(404).end();
        return;
      }
      file = _.find(engine.files, {
        path: filepath
      });
      if (!file) {
        console.log("Error: Couldn't find file in torrent with infoHash: " + infoHash + " and filepath: " + filepath);
        res.status(404).end();
        return;
      }
      range = req.headers.range;
      range = range && rangeParser(file.length, req.headers.range)[0];
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Type', mime.lookup(file.name));
      req.connection.setTimeout(3600000);
      if (!range) {
        res.setHeader('Content-Length', file.length);
      } else {
        res.statusCode = 206;
        res.setHeader('Content-Length', range.end - range.start + 1);
        res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length);
      }
      if (req.method === 'HEAD') {
        return res.end();
      } else {
        return file.createReadStream(range).pipe(res);
      }
    }
  };

}).call(this);
