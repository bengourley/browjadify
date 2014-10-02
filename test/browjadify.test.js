var transform = require('../transform')
  , assert = require('assert')
  , browserify = require('browserify')
  , vm = require('vm')
  , fs = require('fs')

describe('browjadify', function () {

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

    it('should emit a file event when it compiles a jade file', function (done) {

      var b = browserify()

      b.add(__dirname + '/fixtures/b.js')
      b.transform(transform)

      b.pipeline.on('transform', function (tr) {
        tr.on('file', function (file) {
          assert(/\/b\.jade$/.test(file))
          done()
        })
      })

      b.bundle()

    })

  })

  describe('package.json', function () {

    it('should resolve browjadify/compile when run in node', function () {
      assert(require('./fixtures/c-node')(__dirname + '/fixtures/b.jade'))
    })

    it('should resolve browjadify/compile to browjadify/browser when run in browserify', function (done) {

      var b = browserify();
      b.add(__dirname + '/fixtures/c-browser.js')
      b.transform(transform({}))
      b.bundle(function (err, src) {
        if (err) done(err)
        vm.runInNewContext(src, { console: {}, jade: require('jade/lib/runtime'), window: {} })
        assert.notEqual(-1, ('' + src).indexOf(fs.readFileSync(require.resolve('browjadify-compile/browser'))))
        done()
      })

    })

  })

})
