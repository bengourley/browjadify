var compileJade = require('browjadify-compile')

console.log(compileJade(__dirname + '/b.jade')({ b: 'Testy!' }))
