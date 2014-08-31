(function() {
  var request, shows;

  request = require('request');

  shows = {
    index: function(req, res) {
      return request({
        url: "http://api.torrentsapi.com/shows",
        qs: req.query
      }, function(err, response, body) {
        var data;
        data = JSON.parse(body);
        data.shows = data.MovieList;
        delete data.MovieList;
        data.shows.forEach(function(show) {
          return show.show_detailed_id = show.imdb;
        });
        return res.json(data);
      });
    },
    show: function(req, res) {
      var query;
      query = req.query;
      query.imdb = req.params.show_id;
      return request({
        url: "http://api.torrentsapi.com/show",
        qs: query
      }, function(err, response, body) {
        var data, seasons;
        data = JSON.parse(body);
        seasons = Object.keys(data).map(function(value) {
          return {
            id: "" + req.params.show_id + "-" + value,
            season_nr: value,
            episodes: data[value]
          };
        });
        data = {
          show_detailed: {
            id: req.params.show_id,
            seasons: seasons
          }
        };
        return res.json(data);
      });
    }
  };

  exports.shows = shows;

}).call(this);
