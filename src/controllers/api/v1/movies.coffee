request = require('request')
movies =
  index: (req, res) ->
    request(
      url: "http://api.torrentsapi.com/list"
      qs: req.query
    ,
      (err, response, body)->
        data = JSON.parse(body)
        data.movies = data.MovieList
        delete data.MovieList
        res.json data
    )


exports.movies = movies