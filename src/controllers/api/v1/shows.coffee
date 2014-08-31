request = require('request')
shows =
  index: (req, res) ->
    request(
      url: "http://api.torrentsapi.com/shows"
      qs: req.query
    ,
      (err, response, body)->
        data = JSON.parse(body)
        data.shows = data.MovieList
        delete data.MovieList

        data.shows.forEach((show)->
          show.show_detailed_id = show.imdb
        )
        res.json data
    )

  show: (req, res) ->
    query = req.query
    query.imdb = req.params.show_id
    request(
      url: "http://api.torrentsapi.com/show"
      qs: query
    ,
    (err, response, body)->
      data = JSON.parse(body)
      seasons = Object.keys(data).map (value)->
        {
          id: "#{req.params.show_id}-#{value}"
          season_nr: value,
          episodes: data[value]
        }
      data =
        show_detailed:
          id: req.params.show_id
          seasons: seasons

      res.json data
    )

exports.shows = shows