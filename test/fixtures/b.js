var compileJade = require('../..')

var jade = require('jade/lib/runtime')
console.log(compileJade(__dirname + '/b.jade')({ b: 'Testy!' }))