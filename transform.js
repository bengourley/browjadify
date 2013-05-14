var fs = require('fs')
  , path = require('path')
  , through = require('through')
  , falafel = require('falafel')
  , compile = require('./compile')
  , unparse = require('escodegen').generate

module.exports = function (file) {

  if (!/\.js$/.test(file)) return through()

  var data = ''
    , vars = [ '__filename', '__dirname' ]
    , dirname = path.dirname(file)
    , pending = 0
    , tr = through(write, end)

  return tr

  function write(buf) {
    data += buf
  }

  function end () {
    var output
    try {
      output = parse()
      finish(output)
    } catch (err) {
      this.emit('error', new Error(
        err.toString().replace('Error: ', '') + ' (' + file + ')')
      )
    }
  }

  function finish (output) {
    tr.queue(String(output))
    tr.queue(null)
  }

  function parse () {

    var output = falafel(data, function (node) {
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'compileJade') {

        if (node.arguments.length !== 1) {
          throw new Error('compileJade takes 1 argument')
        }

        var args = node.arguments
          , t = 'return ' + unparse(args[0])
          , fpath = new Function(vars, t)(file, dirname)

        var jade = compile(fpath)
        node.update(jade.toString())

      }
    })
    return output
  }
}