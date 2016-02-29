var compileJade = require('browjadify-compile')

console.log(compileJade('"quote\'s".jade')({ h: 'Testy!' }))
