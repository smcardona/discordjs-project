const tr = require('../traductor.js')

// Info
let [rotors, reflectors] = [[
  'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
  'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  'BDFHJLCPRTXVZNYEIWGAKMUSQO',
  'ESOVPZJAYQUIRHXLNFTGKDCMWB',
  'VZBRGITYUPSDNHLXAWMJQOFECK',
  'JPGVOUMFYQBENHZRDKASXLICTW',
  'NZJHGRCXMYSWBOUFAIVLPEKQDT',
  'FKQHTLXOCBJSPDZRAMEWNIUYGV'],
[
  'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  'FVPJIAOYEDRZXWGCTKUQSBNMHL'
]];

// Body 
let Pieces = {
  RO: {},
  RE: {},
  t(value, ro) {
    if ((value - ro['deg']) < 0) return ro.indexOf((value - ro['deg']) + 26)
    else return ro.indexOf(value - ro['deg'])
    //return ro.indexOf((value - ro['deg']) < 1 ? (value - ro['deg']) + 26 : value - ro['deg']);
  },
  g(key, ro) {
    if ((key + ro['deg']) > 25) return ro[(key + ro['deg']) - 26]
    else return ro[key + ro['deg']]
    //return ro[(key + ro['deg']) > 26 ? (key + ro['deg']) - 26 : key + ro['deg']]
  },
  spin(rotors) {
    cRo = rotors;
    if (cRo[0]['deg'] === 25) { cRo[0][0] = 0; cRo.shift(); this.spin(cRo) }
    // DOESNT WORK YET
  }
}

// Constructor
rotors.forEach((v, i) => {
  v = v.split('')
  Pieces.RO[`r${i + 1}`] = v.map((l) => tr[l])
  Pieces.RO[`r${i + 1}`]['deg'] = 1
})
reflectors.forEach((v, i) => {
  v = v.split('')
  Pieces.RE[`r${i + 1}`] = v.map((l) => tr[l])
  Pieces.RE[`r${i + 1}`]['deg'] = 0
})

console.log(Pieces)
// Export 
module.exports = Pieces;