var compileJade = require('browjadify-compile')

console.log(compileJade('/tmp/g.jade')({ g: 'Testy!' }))
