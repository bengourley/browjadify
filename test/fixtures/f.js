var compileJade = require('browjadify-compile')

console.log(compileJade(__dirname + '/f.jade')({ f: 'Testy!' }))
