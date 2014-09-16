request = require('request')
httpsync = require('httpsync')
fs = require('fs')
subtitles =
  get: (video, socket) ->
    console.log "get #{video.id}" 
    request(
      url: "http://api.yifysubtitles.com/subs/#{video.imdb}"
      qs: ""
    ,
      (err, response, body)->
        data = JSON.parse(body)
        subtitles = data.subs[video.imdb]
        socket.emit('data', {model:"movie", id:video.id, attribute:"subtitles", data: subtitles})
    )
  stream: (req, res)->
      if req.params.url
        subtitle = httpsync.get("http://www.yifysubtitles.com/subtitle/#{req.params.url}").end()
        zip = new require('node-zip')(subtitle.data, {base64: false, checkCRC32: true})
        filename = zip.files[Object.keys(zip.files)].name
        res.set('Content-Type', 'text/plain')
        res.send zip.file(filename).asText()

exports.subtitles = subtitles
