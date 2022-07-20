// Necessary Info

/**
 * Thinking in a daily changing rotors system, so every day the drums connections will be different
 * And for compatibility, the random change in the rotors will be determined by a random-seed
 * Thinking in a way that you could create your own seeds so the rotors would be totally different
 * I really want to implement databases in this command, so people could create and save seeds (rotors), passwords (settings), and more
*/

// let rotorSeedString = new Date().toLocaleDateString() // Future seed
const rotorSeedGenerator = require('random-seed').create('temporalSeed')
const { disorder, pickRandom, extractRandom } = require('../../functions/random')

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
let [reflectors, rotors] = [
  alphabet.map(() => {
    let ref = []
    let copy = [...alphabet]
    for (let i = 0; i < alphabet.length / 2; i++) {
      let xd = extractRandom(copy, 2, rotorSeedGenerator)
      ref[alphabet.indexOf(xd[0])] = xd[1]
      ref[alphabet.indexOf(xd[1])] = xd[0]
    }
    return ref
  }),
  alphabet.map(() => disorder(alphabet, rotorSeedGenerator.random))
]
//console.log(rotors[13].join(''))

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
alphabet.forEach((v, i) => { // This loop builds a diccionary with Number = Letter and viceversa
  Pieces.tr[v] = i
  Pieces.tr[i] = v
})
rotors.forEach((v, i) => {  // This loops creates objects of drums with their respective Index = Letter
  Pieces.RO[`r${i + 1}`] = v.map((l) => Pieces.tr[l])
  // Pieces.RO[`r${i + 1}`]['deg'] = 0   // I call this deg because of degrees, but it means to the ticks of rotation in each drum
  Pieces.RO[`r${i + 1}`]['name'] = `r${i + 1}` // Just a development thing to see some results
})
reflectors.forEach((v, i) => {  // This one creates objects of reflectors with their data
  Pieces.RE[`r${i + 1}`] = v.map((l) => Pieces.tr[l])
  Pieces.RE[`r${i + 1}`]['name'] = `r${i + 1}` // Just a development thing to see some results
})

// Extra functions

/**
 * I think this is one of the worst functions in this mechanism, because I dont really know how this can work properly and all the changing alphabets depends on this
 */
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

  if (eng == '') { [eng, sk, tk, pin] = [...'****'] }

  // DRUMS
  if (eng && eng.split('').every(l => alphabet.includes(l) || l == '*')) {
    if (eng == '*') eng = pickRandom(alphabet, 4).join('')
    for (l in eng) {
      if (l == eng.length - 1) { machine.reflector = Pieces.RE[`r${Pieces.tr[eng[l]] + 1}`] || Pieces.RE.r1; break }
      machine.rotors[l] = Pieces.RO[`r${Pieces.tr[eng[l]] + 1}`] || Pieces.RO[`r${Number(l) + 1}`]
    }
    machine.setString += eng
  }
  // CUSTOM ROTATION
  if (pin) { // NOT WORKING YET
    machine.setString += ' ' + pin
  }
  // STARTER KEY
  function setKey(key, tKey) {
    machine.rotors.forEach((v, i) => v['deg'] = Pieces.tr[key[i]] || 0)
    machine.setString += ' ' + (tKey || key)
  }
  if (sk && sk.split('').every(l => alphabet.includes(l) || l == '*')) {
    if (sk == '*') sk = pickRandom(alphabet, eng.length - 1).join('')
    setKey(sk)
  }
  else { for (ro of machine.rotors) ro['deg'] = 0; return machine }
  // TYPE KEY
  if (tk && tk.split('').every(l => alphabet.includes(l))) {
    tk = Pieces.runner(tk, { eng, pin, sk, tk: undefined }, true)
    setKey(tk)
  }
  else if (tk == '*') {
    const newTk = pickRandom(alphabet, sk.length).join('')
    tk = Pieces.runner(newTk, { eng, pin, sk, tk: undefined }, true)
    setKey(newTk, tk)
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