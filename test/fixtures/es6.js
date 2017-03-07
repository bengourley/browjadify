const compileJade = require('browjadify-compile')
const f = (x) => x + 'es6!'

console.log(compileJade(__dirname + '/b.jade')({ b: f('Testy!') }))
