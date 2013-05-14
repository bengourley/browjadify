# Browjadify

browserify jade template inliner

This module is a plugin for browserify to parse the AST for `compileJade()` calls so that you can inline compiled jade template contents into your bundles.


# Simple Example

main.js
```
var tmpl = compileJade(__dirname + '/a.jade')
```

Applying the transform with browserify:

```
var browserify = require('browserify')

var b = browserify('main.js')
b.transform(require('browjadify/transform'))

b.bundle().pipe(fs.createWriteStream('bundle.js'))
```

The line from main.js now looks something like this, depending on the contents of a.jade:
```
var tmpl = function anonymous (locals) {
  //... jade temaplate body here
}
```


# Advanced Example

The simple example is ok, but your linter will complain that `compileJade` is undefined. Also,
if you intend to unit test your browser code within node, `compileJade` *will* be undefined, meaning
your tests can't run.

To solve this problem, browjadify comes with a fully functioning `compileJade` function. Use it like so:

main.js
```
var compileJade = require('browjadify')
  , tmpl = compileJade(__dirname + '/a.jade')
```

To prevent the compiler and its dependencies (i.e jade, which is massive) from being added to the output bundle, the compiler needs to be ignored:

```
var b = browserify('main.js')
b.ignore(require.resolve('browjadify/compile'))
b.transform(require('browjadify/transform'))
```

main.js when bundled will now look like this:
```
var compileJade = {}
  , tmpl = function anonymous (locals) {
      //... jade temaplate body here
    }
```

So pre-bundled it will run happily in node, and post bundle will run happily in the browser.

Happy templating!