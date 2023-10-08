// Necessary Info
// !!!! THIS IS NOT A GOOD WAY TO ENCRYPT YOUR INFORMATION, THIS PROJECT IS JUST CZ I WANTED TO SIMULATE THE "COMPLEX" MECHANISM OF THE ENIGHMA MACHINE AND PUSH IT A BIT MORE
// !!!! IM STILL LEARNING, SO THIS CODE CAN BE REDUNDANT AND WEIRD, ALL CRITICS ARE WELCOMED FOR IMPROVEMENTS THANKS

/**
 * Thinking in a daily changing rotors system, so every day the drums connections will be different
 * And for compatibility, the random change in the rotors will be determined by a random-seed
 * Thinking in a way that you could create your own seeds so the rotors would be totally different
 * I really want to implement databases in this command, so people could create and save seeds (rotors), passwords (settings), and more
*/

// let rotorSeedString = new Date().toLocaleDateString() // Future seed

// This generator is in order to access to a determined convination of rotors
const rotorSeedGenerator = require('random-seed').create('temporalSeed[123]')
const { disorder, pickRandom, extractRandom } = require('../../functions/random')

// These are the characters accepted by the machine, any other char wont be encrypted correctly
const alphabet = '0123456789ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZ!¡¿?()[]{}<>"/+._,:=\'\\'.split('')
if (alphabet.length % 2 !== 0) throw new Error('Alphabet must have an even length in order to rotors work: ' + alphabet.length)

let [reflectors, rotors] = [
  alphabet.map(() => {  // This will make as much reflectors as the amount of characters in the alphabet
    let ref = []
    let copy = [...alphabet]
    for (let i = 0; i < alphabet.length / 2; i++) { // This basically mirrors the value with their index, so if A is in position of Y, then Y will be on the position of A
      let relation = extractRandom(copy, 2, rotorSeedGenerator)
      ref[alphabet.indexOf(relation[0])] = relation[1]
      ref[alphabet.indexOf(relation[1])] = relation[0]
    }
    return ref
  }),

  alphabet.map(() => disorder(alphabet, rotorSeedGenerator.random)) // Same here, this is so the settings of the machine can have any character of the alphabet too
]

// Body 
let Pieces = {
  RO: {}, // Rotors relations are 1 way
  RE: {}, // Reflectors relactions are mirrors, these makes the whole machine work as encrypter and decrypter
  tr: [], // This is just to make the formula below less complex, transform characters into the index they are put 
  /** Going */
  g: (key, ro) => ro[key + ro['deg']] ?? ro[(key + ro['deg']) - alphabet.length],
  /** Turning */
  t: (value, ro) => {
    return ro.indexOf(value) - ro['deg'] < 0 ? (ro.indexOf(value) - ro['deg']) + alphabet.length : ro.indexOf(value) - ro['deg']
    // Meaning is : return the position of the value and THEN rest it to the rotation of the drum, if the value is negative then make it positive (+26 char)
  }
}


// Builders       
alphabet.forEach((v, i) => { // This loop builds a diccionary with Number = Letter and viceversa
  if ('0123456789'.includes(v)) v = Number(v)
  Pieces.tr[v] = i
  Pieces.tr[i] = v
})
rotors.forEach((v, i) => {  // This loops creates objects of drums with their respective Index = Letter
  Pieces.RO[`r${i + 1}`] = v.map((l) => Number(Pieces.tr[l]))
  Pieces.RO[`r${i + 1}`]['deg'] = 0   // I call this deg because of degrees, but it means to the ticks of rotation in each drum
  Pieces.RO[`r${i + 1}`]['name'] = `r${i + 1}` // Just a development thing for easy reading
})
reflectors.forEach((v, i) => {  // This one creates objects of reflectors with their data
  Pieces.RE[`r${i + 1}`] = v.map((l) => Number(Pieces.tr[l]))
  Pieces.RE[`r${i + 1}`]['name'] = `R${i + 1}` // Just a development thing for easy reading
})

// Extra functions
/**
 * I think this is one of the worst functions in this mechanism, because I dont really know how this can work properly and all the changing alphabets depends on this
 */
const spin = (ros, i) => {
  if (!i) i = 0; if (!ros[i]) return;
  for (_ in ros) {
    if (ros[i]['deg'] == alphabet.length - 1) {
      ros[i]['deg'] = 0
      spin(ros, i + 1); return
    } else ros[i]['deg']++; return
  }
}

/**
 * This function is too important to configure different machines, but I kinda dont remember how it worked
 * @param {{Multiple_Strings}} Machine Object with eng, sk, tk, pin in string version 
 * @return {Object} Object with pieces told in "Machine" 
 */
const config = ({ eng, sk, tk, pin }) => {
  let machine = { rotors: [Pieces.RO.r1], reflector: Pieces.RE.r1, setString: '' } // Default machine

  if (eng == '') { [eng, sk, tk, pin] = [...'****'] } // This means all the settings will be generated randomly

  // DRUMS (Rotors and reflectors)
  if (eng && eng.split('').every(l => alphabet.includes(l) || l == '*')) { // Comproves if the characters in ENG exist in local alphabet
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
    machine.rotors.forEach((v, i) => v['deg'] = Pieces.tr[key[i]] || 0) // Rotate the drum to a "degree generated" 
    machine.setString += ' ' + (tKey || key)
  }
  if (sk && sk.split('').every(l => alphabet.includes(l) || l == '*')) { // Always check if the character exists in local alphabet
    if (sk == '*') sk = pickRandom(alphabet, eng.length - 1).join('') // Generates random sk
    setKey(sk)
  }
  else { for (ro of machine.rotors) ro['deg'] = 0; return machine }
  // TYPE KEY
  if (tk && tk.split('').every(l => alphabet.includes(l))) {
    tk = Pieces.runner(tk, { eng, pin, sk, tk: undefined }, true)
    setKey(tk)
  }
  else if (tk == '*') {
    const newTk = pickRandom(alphabet, sk.length).join('') // Generated key to type in runner.
    tk = Pieces.runner(newTk, { eng, pin, sk, tk: undefined }, true) // Answer of runner after typed newTk, so this is the actual configuration of keys {String}
    //console.log(newTk, tk)
    setKey(tk, newTk) // 2 args: First is the one 
  }
  return machine

}

/** 
 * DEPRECATED, I'll create a better system for testing and visualizing the way the machine works, this is just to visualize the machine is all good 
 * but now its not easy to see because there are too many characters
 * @param {Array[Machine]} machines - One or more machines to show in tables
*/
function showEngines(machines) {
  for (const machine of machines) {
    const table = require('ascii-table')
    engineTable = new table(machine.inner).setHeading('', ...alphabet).addRow('', ...alphabet.map(v => Pieces.tr[v]))
    let rotorsM = []
    for (let rotor of machine.rotors) {
      rotorsM.push(rotors[Number(rotor.name[1]) - 1])
    }
    rotorsM.forEach((v, i) => {
      engineTable.addRow(machine.rotors[i].name, ...v)
      engineTable.addRow(machine.rotors[i].name, ...machine.rotors[i])
    })
    engineTable.addRow(machine.reflector.name, ...machine.reflector)
    console.log(engineTable.toString())
  }
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
    let tempL = Number(this.tr[char]) // Translates the letter to number
    for (let j = 0; j < rotors * 2 + 1; j++) { // Cycles trough rotors and reflectors
      let cycles = rotors - Math.abs(j - rotors) // 0, 1, 2, ..n, reflector, n.., 2, 1, 0
      // The middle cycle when we use the reflector
      if (j === rotors) tempL = machine.reflector[tempL]
      // Going cycles when the signal is going forward trough the rotors
      else if (j < rotors) tempL = this.g(tempL, machine.rotors[cycles])
      // Turning cycles when the signal is going backwards trough the rotors
      else if (j > rotors) tempL = this.t(tempL, machine.rotors[cycles])
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