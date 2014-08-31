path = require('path')

config =
  root_path: __dirname
  tmp_path: "#{__dirname}/../tmp"
  wnpc:
    index_path: path.normalize("#{__dirname}/../node_modules/wnpc/dist/index.html")
    assets_path: path.normalize("#{__dirname}/../node_modules/wnpc/dist/assets")
  storage:
    path: path.normalize("#{__dirname}/../store.json")

module.exports = config