app = require('./../app').app
path = require('path')
config = require('./../config')
api =
  v1:
    movies: require('./../controllers/api/v1/movies').movies
    shows: require('./../controllers/api/v1/shows').shows
app.get "/api/v1/movies", api.v1.movies.index
app.get "/api/v1/shows", api.v1.shows.index
app.get "/api/v1/show_detaileds/:show_id", api.v1.shows.show
