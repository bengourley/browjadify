var compileJade = require('../..')

require('jade/runtime')
console.log(compileJade(__dirname + '/b.jade')({ b: 'Testy!' }))