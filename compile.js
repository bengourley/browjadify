module.exports = compile

var jade = require('jade')
  , fs = require('fs')

function compile(filename) {

  var hasClientFn = 'function' === typeof jade.compileClient
    , options =
      { compileDebug: false
      , filename: filename
      }

  if (!hasClientFn) options.client = true
  var fn = jade[hasClientFn ? 'compileClient' : 'compile'](fs.readFileSync(filename), options)
  return 'string' === typeof fn ? Function('return ' + fn)() : fn

}
