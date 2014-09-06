schedule = require('node-schedule')
fs       = require('fs')
config   = require('./config')
_        = require('lodash')
moment   = require('moment')

module.exports = (->
  console.log "Starting vacuum cleaner"
  
  rule = new schedule.RecurrenceRule()
  rule.hour = 1
  rule.minute = 0
  rule.second = 0

  schedule.scheduleJob rule, ->
    console.log "Checking for old files..."
    fs.readdir("#{config.tmp_path}/torrent-stream", (err, files) ->
      files.forEach (filename) ->
        file = fs.statSync("#{config.tmp_path}/torrent-stream/#{filename}")
        diff = moment().diff(file.mtime)
        if moment.duration(diff).get("days") > 1
          # Remove file
          console.log "remove file: #{filename}"
    )

)()