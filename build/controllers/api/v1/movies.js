(function() {
  var movies, request;

  request = require('request');

  movies = {
    index: function(req, res) {
      return request({
        url: "http://api.torrentsapi.com/list",
        qs: req.query
      }, function(err, response, body) {
        var data;
        data = JSON.parse(body);
        data.movies = data.MovieList;
        delete data.MovieList;
        return res.json(data);
      });
    }
  };

  exports.movies = movies;

}).call(this);
