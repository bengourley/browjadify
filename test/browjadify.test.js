var compile = require('../compile')
  , transform = require('../transform')
  , assert = require('assert')
  , browserify = require('browserify')
  , vm = require('vm')
  , fs = require('fs')

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
        vm.runInNewContext(src, { console: { log: log }, jade: require('jade/lib/runtime'), window: {} })
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
        vm.runInNewContext(src, { console: { log: log }, jade: require('jade/lib/runtime'), window: {} })
      })

      function log (msg) {
        assert.equal('<p>Testy!</p>', msg)
        done()
      }

    })

  })

  describe('package.json', function () {

    it('should resolve browjadify/compile when run in node', function () {
      assert(require('./fixtures/c-node')(__dirname + '/fixturss/b.jade'))
    })

    it('should resolve browjadify/compile to browjadify/browser when run in browserify', function (done) {

      var b = browserify();
      b.add(__dirname + '/fixtures/c-browser.js')
      b.transform(transform({}))
      b.bundle(function (err, src) {
        if (err) done(err)
        vm.runInNewContext(src, { console: {}, jade: require('jade/lib/runtime'), window: {} })
        assert.notEqual(-1, src.indexOf(fs.readFileSync(__dirname + '/../browser.js')))
        done()
      })

    })

  })

})
