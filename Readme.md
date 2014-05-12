# Browjadify

browserify jade template inliner

This module is a browserify transform which will parse the AST for `compileJade()`
calls and swap them out for the compiled contents of the jade file that they referenced.

# Example

main.js
```js
var tmpl = compileJade(__dirname + '/a.jade')
```

Applying the transform with the browserify CLI:

```
browserify . -o bundle.js -t browjadify
```

Applying the transform with the browserify CLI, but configuring via `package.json`:

```
browserify . -o bundle.js
```

```json
{
  "browserify": {
    "transform": [ "browjadify" ]
  }
}
```

Applying the transform with the browserify API:

```js
var browserify = require('browserify')

var b = browserify('main.js')
b.transform('browjadify')

b.bundle().pipe(fs.createWriteStream('bundle.js'))
```

The line from main.js now looks something like this, depending on the contents of a.jade:
```js
var tmpl = function anonymous (locals) {
  //... jade temaplate body here
}
```

### A note about linting and testing

If you use a linter to check your code for the use of undefined variables, it will
complain about this `compileJade()` function that you have magicked from nowhere.
Furthermore, if you want to test your code with node, without browserifying it,
you can't because the transform will not have been run. These two problems are solved
by doing the following:

```js
var compileJade = require('browjadify/compile')
  , tmpl = compileJade(__dirname + '/a.jade')
```

By defining `compileJade` you are appeasing your linter. When this gets browserified,
`browjadify/compile` resolves to a file that throws an error saying that it shouldn't
ever get called. This is helpful because it means the browjadify transform would
not have been.

When running this code in node, `browjadify/compile` resolves to a function which
synchronously compiles some jade, as advertised! This means that you can run this
code (in unit tests, for instance) without having to browserify and transform it
first.

Happy templating!
