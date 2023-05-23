import Identity from './index.js'


var id = await Identity.create()

console.log(id.getSeedphrase())
console.log(id.getAddress())
console.log(id.getPublicKey())
console.log(id.getPrivateKey())

console.log(id.sign())
console.log(id.verify())
console.log(id.encrypt())
console.log(id.decrypt())