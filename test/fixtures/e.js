var compileJade = require('browjadify-compile')

console.log(compileJade('e.jade')({ e: 'Testy!' }))
