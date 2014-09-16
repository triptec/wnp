(function() {
  var fs, httpsync, request, subtitles;

  request = require('request');

  httpsync = require('httpsync');

  fs = require('fs');

  subtitles = {
    get: function(video, socket) {
      console.log("get " + video.id);
      return request({
        url: "http://api.yifysubtitles.com/subs/" + video.imdb,
        qs: ""
      }, function(err, response, body) {
        var data;
        data = JSON.parse(body);
        subtitles = data.subs[video.imdb];
        return socket.emit('data', {
          model: "movie",
          id: video.id,
          attribute: "subtitles",
          data: subtitles
        });
      });
    },
    stream: function(req, res) {
      var filename, subtitle, zip;
      if (req.params.url) {
        subtitle = httpsync.get("http://www.yifysubtitles.com/subtitle/" + req.params.url).end();
        zip = new require('node-zip')(subtitle.data, {
          base64: false,
          checkCRC32: true
        });
        filename = zip.files[Object.keys(zip.files)].name;
        res.set('Content-Type', 'text/plain');
        return res.send(zip.file(filename).asText());
      }
    }
  };

  exports.subtitles = subtitles;

}).call(this);
