request = require('request')
movies =
  index: (req, res) ->
    request(
      url: "http://api.torrentsapi.com/list"
      qs: req.query
    ,
      (err, response, body)->
        data = JSON.parse(body)
        data.movies = data.MovieList.map((movie)->
          movie.items = movie.items.map((torrent)->
            torrent.movie = movie.id
            torrent
          )
          movie
        )
        delete data.MovieList
        res.json data
    )


exports.movies = movies
