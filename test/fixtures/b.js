var compileJade = require('../..')

console.log(compileJade(__dirname + '/b.jade')({ b: 'Testy!' }))
