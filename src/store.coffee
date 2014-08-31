fs     = require("fs")
config = require('./config')
_      = require('lodash')

# Check if storage exist, otherwise create it
unless fs.existsSync(config.storage.path)
  fs.writeFileSync(config.storage.path, JSON.stringify({
    torrents: []
  }), "utf8")

module.exports =
  data: require('./../store.json')
  
  find: (type, attrs) ->
    results = _.where(@data[type], attrs)
    if results.length > 0
      results[0]
    else
      false

  create: (type, attrs) ->
    @data[type].push attrs
    @save()

  save: ->
    fs.writeFile(config.storage.path, JSON.stringify(@data), "utf8")