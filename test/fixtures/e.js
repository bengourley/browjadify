var compileJade = require('browjadify-compile')
  , path = require('path')

console.log(compileJade(path.join(__dirname, '/b.jade'))({ b: 'Testy!' }))
