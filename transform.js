module.exports = createTransform

var path = require('path')
  , through = require('through')
  , falafel = require('falafel')
  , compile = require('./compile')
  , unparse = require('escodegen').generate

function createTransform(arg) {
  // standard usage, no options
  if (typeof arg === 'string') return transform.call({ options: {} }, arg)
  // configured usage, returns transform bound with some options
  return transform.bind({ options: arg })
}

function transform(file) {

  if (!/\.js$/.test(file)) return through()
  if (this.options.noParse && this.options.noParse.indexOf(file) !== -1) return through()

  var data = ''
    , vars = [ '__filename', '__dirname' ]
    , dirname = path.dirname(file)
    , tr = through(write, end)
    , start = new Date()

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
    var timeTaken = new Date() - start
    if (timeTaken > 500) {
      console.warn(
        [ ''
        , 'WARNING: browjadify took ' + timeTaken + 'ms to parse this file…'
        , file
        , 'If you don\'t need to parse it for `compileJade()` calls, consider using the'
        , 'alternative interface to browjadify where you can supply the `noParse` option.'
        , ''
        ].join('\n'))
    }
  }

  function parse () {

    /* jshint evil:true */

    var output = falafel(data, function (node) {
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'compileJade') {

        if (node.arguments.length !== 1) {
          throw new Error('compileJade takes 1 argument')
        }

        var args = node.arguments
          , t = 'return ' + unparse(args[0])
          , fpath = new Function(vars, t)(file, dirname)
          , jade = compile(fpath)
        node.update(jade.toString())

      }
    })
    return output
  }
}
