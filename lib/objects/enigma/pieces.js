// Necessary Info
let [rotors, reflectors, translator] = [[
  'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
  'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  'BDFHJLCPRTXVZNYEIWGAKMUSQO',
  'ESOVPZJAYQUIRHXLNFTGKDCMWB',
  'VZBRGITYUPSDNHLXAWMJQOFECK',
  'JPGVOUMFYQBENHZRDKASXLICTW',
  'NZJHGRCXMYSWBOUFAIVLPEKQDT',
  'FKQHTLXOCBJSPDZRAMEWNIUYGV'
], [
  'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  'FVPJIAOYEDRZXWGCTKUQSBNMHL'
], 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
]

// Body 
let Pieces = {
  RO: {},
  RE: {},
  tr: {},
  g: (key, ro) => ro[key + ro['deg']] ?? ro[(key + ro['deg']) - 26],
  t: (value, ro) => {
    /* This seems complicated but it isnt
      Its an inverse formula of the one in g(), needed to make the process once the reflector gives an output 
      DONT TOUCH OR CHANGE THINGS IF U COPY THE REP, I tried to improve the formula but its hard to understand the mechanics in the output*/
    return ro.indexOf(value) - ro['deg'] < 0 ? (ro.indexOf(value) - ro['deg']) + 26 : ro.indexOf(value) - ro['deg']
    // Meaning is : return the position of the value and THEN rest it to the rotation of the drum, if the value is negative then make it positive (+26 char)
  }
}


// Builders          / I can probably improve these builders later
translator.forEach((v, i) => { // This loop builds a diccionary with Number = Letter and viceversa
  Pieces.tr[v] = i
  Pieces.tr[i] = v
})
rotors.forEach((v, i) => {  // This loops creates objects of drums with their respective Index = Letter
  v = v.split('')
  Pieces.RO[`r${i + 1}`] = v.map((l) => Pieces.tr[l])
  // Pieces.RO[`r${i + 1}`]['deg'] = 0   // I call this deg because of degrees, but it means to the ticks of rotation in each drum
  Pieces.RO[`r${i + 1}`]['name'] = `r${i + 1}` // Just a development thing to see some results
})
reflectors.forEach((v, i) => {  // This one creates objects of reflectors with their data
  v = v.split('')
  Pieces.RE[`r${i + 1}`] = v.map((l) => Pieces.tr[l])
  Pieces.RE[`r${i + 1}`]['name'] = `r${i + 1}` // Just a development thing to see some results
})

// Extra functions
const spin = (ros, i) => {
  if (!i) i = 0; if (!ros[i]) return;
  for (_ in ros) {
    if (ros[i]['deg'] == 25) {
      ros[i]['deg'] = 0
      spin(ros, i + 1); return
    } else ros[i]['deg']++; return
  }
}
const config = ({ eng, sk, tk, pin }) => {
  let machine = { rotors: [Pieces.RO.r1, Pieces.RO.r2, Pieces.RO.r3], reflector: Pieces.RE.r1, setString: '' } // Default machine
  if (eng) {
    for (l in eng) {
      if (l == eng.length - 1) { machine.reflector = Pieces.RE[`r${Pieces.tr[eng[l]] + 1}`] ?? Pieces.RE.r1; break }
      machine.rotors[l] = Pieces.RO[`r${Pieces.tr[eng[l]] + 1}`] ?? Pieces.RO[`r${l + 1}`]
    }
    machine.setString += eng
  }
  if (pin) { // NOT WORKING YET
    machine.setString += ' ' + pin
  }
  if (sk) {
    machine.rotors.forEach((v, i) => v['deg'] = Pieces.tr[sk[i]] ?? 0)
    machine.setString += ' ' + sk
  } else { for (ro of machine.rotors) ro['deg'] = 0; return machine }
  if (tk) {
    /* Need a new function to pick random letters, so if someone wants to a password then it could make one random
    Dont try to add values in the input to define this variable, bcz it wont return the output you may expect*/
    tk = Pieces.runner(tk, { eng, sk, tk: undefined }, true)
    machine.rotors.forEach((v, i) => v['deg'] = Pieces.tr[tk[i]] ?? 0)
    machine.setString += ' ' + tk
  }
  return machine

}

// RUNNER 
function runner(txt, settings, processK) {
  let machine = config(settings)

  /* Machine = {
    rotors: [ roX, roX, roX, ...],      // X Means a number
    reflector: reX,
    setString: 'TXT'
  } */

  let outT = ""; // Output Text variable
  let rotors = machine.rotors.length // Amount of rotors that user has
  for (char of txt) { // Iterates all characters even spaces
    if (char === " ") { outT += " "; continue } // Doesnt translate spaces
    let tempL = this.tr[char] // Translates the letter to number
    for (let j = 0; j < rotors * 2 + 1; j++) { // Cycles trough rotors and reflectors
      let cycles = rotors - Math.abs(j - rotors) // 0, 1, 2, ..n, reflector, n.., 2, 1, 0
      // The middle cycle when we use the reflector
      if (j === rotors) tempL = machine.reflector[tempL]
      // Turning cycles when the signal is going backwards trough the rotors
      else if (j > rotors) tempL = this.t(tempL, machine.rotors[cycles])
      // Going cycles when the signal is going forward trough the rotors
      else if (j < rotors) tempL = this.g(tempL, machine.rotors[cycles])
    }

    outT += this.tr[tempL] // Traslate of the processed number to letter
    this.spin(machine.rotors) // Makes the rotation of the drums
  }
  // Returns a different output, if there is no settings or if is an output to makes a Type key
  return processK ? outT : `${machine.setString} | ${outT}`
}

Pieces.spin = spin
Pieces.runner = runner.bind(Pieces) // This is just to say this.property instead of saying all the time Pieces

// Exports
module.exports = Pieces.runner