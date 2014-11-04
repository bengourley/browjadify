module.exports = createTransform

var path = require('path')
  , through = require('through')
  , falafel = require('falafel')
  , compile = require('browjadify-compile')
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
    , options = this.options

  return tr

  function write(buf) {
    data += buf
  }

  function end () {

    var output

    // Do a quick regex check to see if it looks like a `compileJade()` function
    // appears in the file. It's expensive to parse the AST in an app with lots of
    // files, so checking this first will hopefully prevent some unnecesary slow builds.

    if (!/compileJade(.*)/.test(data)) return finish(output)

    try {
      output = parse.call(this)
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
    if (timeTaken > 500 && !options.quiet) {
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

        if (node.arguments.length !== 1) throw new Error('compileJade takes 1 argument')

        var args = node.arguments
          , t = 'return ' + unparse(args[0])
          , fpath = new Function(vars, t)(file, dirname)
          , jade = compile(fpath)

        node.update(jade.toString())

        // Emit the template file so that bundle watchers (like watchify) include
        // it in the set of files it watches for changes
        this.emit('file', fpath)
        if (Array.isArray(jade.dependencies)) {
          jade.dependencies.forEach(function (fpath) { this.emit('file', fpath) }.bind(this))
        }

      }

    }.bind(this))

    return output

  }

}
