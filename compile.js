module.exports = compile

var jade = require('jade/lib/jade')
  , fs = require('fs')

function compile(filename) {
  var jadeOptions =
    { client: true
    , compileDebug: false
    , filename: filename
    }
  return jade.compile(fs.readFileSync(filename), jadeOptions)
}