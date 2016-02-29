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

    it('should emit a file event when it finds a jade file', function (done) {

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

    it('should emit a file event for dependent jade files (via include/extend within jade)', function (done) {

      var b = browserify()

      b.add(__dirname + '/fixtures/d.js')
      b.transform(transform)

      b.pipeline.on('transform', function (tr) {
        tr.once('file', function (file) {
          assert(/\/d\.jade$/.test(file))
          tr.once('file', function (file) {
            assert(/\/a\.jade$/.test(file))
            done()
          })
        })
      })

      b.bundle()

    })

    describe('baseDir option', function () {

      it('should prefix the baseDir when a relative path is found', function (done) {

        var b = browserify()
        b.add(__dirname + '/fixtures/e.js')
        b.transform(transform({ baseDir: __dirname + '/fixtures/e' }))
        b.bundle(function (err, src) {
          if (err) done(err)
          vm.runInNewContext(src, { console: { log: log }, jade: require('jade/lib/runtime'), window: {} })
        })

        function log (msg) {
          assert.equal('<p>Testy!</p>', msg)
          done()
        }

      })

      it('should allow files to have quotes in their names', function (done) {

        var b = browserify()
        b.add(__dirname + '/fixtures/h.js')
        b.transform(transform({ baseDir: __dirname + '/fixtures/h' }))
        b.bundle(function (err, src) {
          if (err) done(err)
          vm.runInNewContext(src, { console: { log: log }, jade: require('jade/lib/runtime'), window: {} })
        })

        function log (msg) {
          assert.equal('<p>Testy!</p>', msg)
          done()
        }

      })

      it('should not use the baseDir when __dirname + "/path" is used', function (done) {

        var b = browserify()
        b.add(__dirname + '/fixtures/f.js')
        b.transform(transform({ baseDir: __dirname + '/fixtures/f' }))
        b.bundle(function (err, src) {
          if (err) done(err)
          vm.runInNewContext(src, { console: { log: log }, jade: require('jade/lib/runtime'), window: {} })
        })

        function log (msg) {
          assert.equal('<p>Testy!</p>', msg)
          done()
        }

      })

      it('should not use the baseDir when an absolute path is used', function (done) {

        var b = browserify()
          , template = fs.createReadStream(__dirname + '/fixtures/g.jade')
          , tmpTemplate = fs.createWriteStream('/tmp/g.jade')

        template.pipe(tmpTemplate)

        b.add(__dirname + '/fixtures/g.js')
        b.transform(transform({ baseDir: __dirname + '/fixtures/g' }))
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
