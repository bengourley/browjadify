var compile = require('../compile')
  , transform = require('../transform')
  , assert = require('assert')
  , browserify = require('browserify')
  , vm = require('vm')

global.jade = require('jade/runtime')

describe('browjadify', function () {

  describe('compile()', function () {

    it('should take a filename and return a js function', function () {
      var template = compile(__dirname + '/fixtures/a.jade')
      assert.equal(typeof template, 'function')
      assert(/^function (anonymous|template)\(locals/.test(template.toString()))
      assert(/^<!DOCTYPE html>/.test(template()))
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

    it('should support configuration with the `createTransform(options)` interface', function (done) {

      var b = browserify();
      b.add(__dirname + '/fixtures/b.js')
      b.transform(transform({}))
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
