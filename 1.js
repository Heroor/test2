var b = require('./com.js')
var a = require('./2.js')
console.log('--------------')
console.log('111111111111111')
console.log(b)
console.log(a.a)
console.log(a.a == b)
console.log('--------------')
if (module.hot) {
    module.hot.accept(function () {
        console.log('hotttttttttttttttttttt!')
    })
}