var compile = require('..')
  , transform = require('../transform')
  , assert = require('assert')
  , browserify = require('browserify')
  , vm = require('vm')

describe('browjadify', function () {

  describe('compile()', function () {

    it('should take a filename and return a string of js', function () {
      var template = compile(__dirname + '/fixtures/a.jade')
      assert.equal(typeof template, 'string')
      assert(/^function anonymous\(locals\) {/.test(template))
    })

    it('should throw an error when template does not exist', function () {
      assert.throws(function () {
        compile(__dirname + '/fixtures/x.jade')
      })
    })

  })

  describe('transform()', function () {

    it('should inject compiled templates in place of `compileJade(path)`', function (done) {

      var b = browserify();
      b.add(__dirname + '/fixtures/b.js')
      b.ignore(require.resolve('..'))
      b.transform(transform)
      b.bundle(function (err, src) {
        if (err) done(err)
        vm.runInNewContext(src, { console: { log: log } })
      })

      function log (msg) {
        assert.equal('<p>Testy!</p>', msg)
        done()
      }

    })

  })

})