store       = require('./../store')
rangeParser = require('range-parser')
_           = require('lodash')
mime        = require('mime')

module.exports = 
  all: (req, res) ->
    engine = store.find(req.params.infoHash)

    # Return 404 if torrent doesn't exist in store
    unless engine
      console.log "Error: Couldn't find torrent with infoHash: #{req.params.infoHash} and filepath: #{req.params.filepath}"
      res.status(404).end()
      return

    file = _.find engine.files, { path: req.params.filepath }

    range = rangeParser(file.length, req.headers.range)[0]

    # Set headers
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Type', mime.lookup(file.name))
    req.connection.setTimeout(3600000) # NOTE: Does this cause any performance issues?

    # Do we have a range?
    unless range
      res.setHeader('Content-Length', file.length)
    else
      # We have range!
      res.statusCode = 206 # Partial content
      res.setHeader('Content-Length', range.end - range.start + 1)
      res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)

    if req.method == 'HEAD'
      res.end()
    else
      file.createReadStream(range).pipe(res)
