var compileJade = require('../../compile')

console.log(compileJade(__dirname + '/b.jade')({ b: 'Testy!' }))
