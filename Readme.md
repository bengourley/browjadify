# Browjadify

browserify jade template inliner

This module is a plugin for browserify to parse the AST for `compileJade()` calls so that you can inline compiled jade template contents into your bundles.


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

Pre v1 had some weird 'ignore' shit going on avoid the jade compiler from being added
to your browser bundle. I'm pleased to say that this is now gone!

Happy templating!
