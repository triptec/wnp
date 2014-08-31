fs     = require("fs")
config = require('./config')
_      = require('lodash')

# Check if storage exist, otherwise create it
unless fs.existsSync(config.storage.path)
  fs.writeFileSync(config.storage.path, JSON.stringify({
    torrents: []
  }), "utf8")

module.exports =
  find: (type, data) ->
    storage = @get_storage()
    results = _.where(storage[type], data)
    if results.length > 0
      results[0]
    else
      false

  create: (type, data) ->
    storage = @get_storage()
    if storage[type]
      storage[type].push data
      @save(storage)
    else
      console.log "#{type} type doesn't exist"

  save: (storage) ->
    fs.writeFileSync(config.storage.path, JSON.stringify(storage), "utf8")

  get_storage: ->
    require(config.storage.path)