/**
 * Code rework for the program of enigma machine encryption.
 * The original original code i made some years ago is still in src/utils/objects/enigma/pieces.js
 */

export class EnigmaMachine {
  rotors: Rotor[] = [MachinePieces.rotors.X1]; // default rotors = X1
  reflector: Reflector = MachinePieces.reflectors.C1; // default reflector = C1

  config: MachineConfig = { 
    engines: "00", 
    initialPosition: "0", 
    pins: "0", 
    password: "", 
    toString: "00 0 0" 
  }; // default config = all at 0

  constructor(config: Partial<MachineConfig>) {
    this.configure(config);
  }

  public configure (conf: Partial<MachineConfig>) {
    let { engines, initialPosition, pins, password } = conf;
    if (!engines) { // Have in mind that this will execute if @engines is undefined or ""
      return this.reset();
    }

    this.config.toString = "";

    const isValidConfigField = (text: string | undefined): text is string => 
      !!text && text.split('').every(l => alphabet.includes(l) || l == '*');
  
    //* ENGINES / DRUMS (Rotors and reflectors)
    if (isValidConfigField(engines)) { // Comproves if the engine setting is valid
      this.setEngines(engines);
    }
    
    //* CUSTOM ROTATION
    if (pins) { // NOT IMPLEMENTED YET
      this.config.toString += ' ' + pins;
    }

    //* INITIAL POSITION
    if (isValidConfigField(initialPosition)) { // Always check if the character exists in local alphabet
      this.setInitialPosition(initialPosition);
    }
    else { // this makes sure it resets
      this.rotors.forEach(ro => ro.degree = 0);
      return;
    }

    //* PASSWORD
    if (isValidConfigField(password)) {
      this.setPassword(password);
    }
  }

  private setEngines(engines: string) {
    // if * then there will be generated 3 rotors and a reflector
    const DEFAULT_ENGINES = 4;
    if (engines == '*') engines = pickRandom(alphabet, DEFAULT_ENGINES).join(''); //
      
    for (const [i, l] of engines.split("").entries()) { //* i: index, l: letter

      if (i == engines.length - 1) { //* last index means the letter for reflector
        this.reflector = 
          MachinePieces.reflectors[`C${MachinePieces.translator[l] + 1}`] ??  // remember +1 cz minimum key for pieces is C1 then to Cn
          MachinePieces.rotors.C1; //* If for any reason there is not a reflector then adds the normal 
        break; 
      }

      this.rotors[i] = 
        MachinePieces.rotors[`X${MachinePieces.translator[l] + 1}`] ?? 
        MachinePieces.rotors[`X${i + 1}`]; //* If not found then it adds X1 ... Xn rotors
    }
    this.config.toString += engines;
  }

  private setInitialPosition(position: string) {
    if (position == '*') position = pickRandom(alphabet, this.config.engines.length - 1).join(''); // Generates random position
    this.setPosition(position);
  }

  private setPassword(password: string) {
    const internalProcessParams = {textOnly: true, config: { ...this.config, password: undefined }};
    if (password == '*') {
      const newKey = pickRandom(alphabet, this.config.initialPosition.length).join(''); // Generated key to type in runner.
      // Answer of runner after typed newKey, so this is the actual position, but the one used to get it is @newKey
      password = this.run(newKey, internalProcessParams);

      this.setPosition(password, newKey);
    }
    else {
      password = this.run(password, internalProcessParams);
      this.setPosition(password)
    }
  }

  /**
     * Rotates the rotors to the position of the letters specified
     * @param key Letter related to the rotor position f.e A: 1. this key will spin the rotor to that position
     * @param maskKey Letters that will be shown, needed for passwords: read about the second letter convination of enigma
     */
  private setPosition(key: string, maskKey?: string) {
    this.rotors.forEach((v, i) => v.degree = MachinePieces.translator[key[i]] ?? 0); // Rotate the drum to a "degree generated" 
    this.config.toString += ' ' + (maskKey || key);
  }

  /**
   * Recursive functions that rotates a drum and then if the drum is reset to its position, then it rotates the next in case
   * the last drum got reset or hit the rotating pin
   * @param i Index of the rotor that is going to be rotated (spin)
   */
  public spin (i = 0): void {
    if (!this.rotors[i]) return; // end case
    
    this.rotors[i].degree = (this.rotors[i].degree + 1) % alphabet.length;
    
    // todo: rethink the way the rotors makes the next rotor spin
    // todo: maybe instead of === 0, checking if it is the position especified in config.pin to this rotor
    /**
     * That would require to store that setting somewhere, or maybe get the value from the config string
     * Or maybe just ignore this behaviour and program something different, like randomly generating rotating factors
     * for each rotor. For now they make the next one spin at 0 position, but it could be at more random position
     */
    if (this.rotors[i].degree === 0) // recursive case
      this.spin(i + 1); 
    
  }

  public reset(): void { this.configure(this.config) }

  public run (
    txt: string, 
    options: { config?: Partial<MachineConfig> , textOnly?: boolean, verbosed?: boolean } = {}
  ) {
    
    const machine = options.config ? new EnigmaMachine(options.config) : this;
    if (!txt) return options.textOnly ? "" : `${machine.config.toString} |`;

    let result = ""; // Output Text variable
    let rotorsCount = machine.rotors.length; // Amount of rotors the user has set
    for (const char of txt.toUpperCase()) { // Iterates all characters
      if (!alphabet.includes(char)) { result += char; continue } // Doesnt translate unknown chars
      let translated: number = MachinePieces.translator[char]; // Translates the letter to an index temporal Number
                                                            // this letter will be modified constantly trough the engines
      for (let j = 0; j < rotorsCount * 2 + 1; j++) { // Cycles trough rotors and reflectors. 3 rotos = 7 cycles = 3 forward, 1 reflection 3 backward
        const cycle = rotorsCount - Math.abs(j - rotorsCount); // 0, 1, 2, ..n, reflector, n.., 2, 1, 0
        // The middle cycle when we use the reflector
        if (j === rotorsCount) translated = machine.reflector.getReflection(translated, options.verbosed);
        // Going cycle when the signal is going forward trough the rotors
        else if (j < rotorsCount) translated = machine.rotors[cycle].getForward(translated, options.verbosed);
        // Turning cycle when the signal is going backwards trough the rotors
        else if (j > rotorsCount) translated = machine.rotors[cycle].getBackward(translated, options.verbosed);
      }
  
      result += MachinePieces.translator[translated]; // Traslate of the processed number to letter
      machine.spin(); // Makes the rotation of the drums
    }
    console.log(txt, "=", result);
    this.print();
    // Returns a different output, if there is no settings or if is an output to makes a Type key
    return options.textOnly ? result : `${machine.config.toString} | ${result}`;
  }


  print () {
    console.log("MACHINE".bgBlue);
    for (const ro of this.rotors) {
      console.log("  "+ro.connections.map(c => MachinePieces.translator[c]).join("").green, 
          "\t"+ro.name.white); // print each rotor with its name
    }
    console.log("  "+this.reflector.connections.map(c => MachinePieces.translator[c]).join("").blue, 
          "\t"+this.reflector.name.white); // print the reflector

    console.log("  "+("".padEnd(alphabet.length, "012345789"))); // print a guide index
    console.log("  "+alphabet.join(""))


  }

}

//* Declaration zone
/** Configuration settings for the Enigma machine. */
export type MachineConfig = {
  /** A string representing the configuration of the rotors and reflector.
   * The last character represents the reflector, and the preceding characters represent the rotors.
   * If the string is '*', a random configuration is generated. */
  engines: string
  /** A string representing custom pin settings for the rotors. (Not implemented yet) */
  pins: string
  /** A string representing the initial position of the rotors.
   * If the string is '*', a random initial position for each rotor is generated. */
  initialPosition: string
  /**  A string representing the password for the Enigma machine.
   * If the string is '*', a random password is generated.
   * For more info check: [indicator](https://en.wikipedia.org/wiki/Enigma_machine#Indicator) */
  password: string
  /** A string representation of the current configuration of the Enigma machine. */
  toString: string
}

class Reflector {
  readonly name: string;
  readonly connections: number[];

  constructor (name: string, connections: number[]) {
    this.name = name;
    this.connections = connections;
  }

  public getReflection (key: number, verbosed?: boolean) {
    if (verbosed)
      console.log(`${MachinePieces.translator[key]} => ${MachinePieces.translator[this.getReflection(key)]}`,
        `bcz index: ${key} = ${this.getReflection(key)}`.yellow);

    return this.connections[key] 
  }
}

class Rotor {
  readonly name: string;
  readonly connections: number[];
  public degree: number = 0; 
  
  constructor (name: string, connections: number[]){
    this.name = name;
    this.connections = connections;
  }
  //*  magic functions
  public getForward(key: number, verbosed?: boolean): number {
    if (verbosed) 
      console.log(`${MachinePieces.translator[key]} => ${MachinePieces.translator[this.getForward(key)]}`,
        `bcz index: ${key} + ${this.degree} = ${this.getForward(key)}`.yellow);

    const index = (key + this.degree) % alphabet.length;
    return this.connections[index];
  }

  public getBackward(value: number, verbosed?: boolean): number {
    if (verbosed)
      console.log(`${MachinePieces.translator[value]} => ${MachinePieces.translator[this.getBackward(value)]}`,
        `bcz index of: (${MachinePieces.translator[value]})${this.connections.indexOf(value)} - ${this.degree} = ${this.getBackward(value)}`.yellow);

    const index = this.connections.indexOf(value) - this.degree;
    return (index + alphabet.length) % alphabet.length; // safe handle
  }
}


type ReflectorCollection = { [key: string ]: Reflector }
type RotorCollection = { [key: string ]: Rotor }
type Translator = { [key: number]: number | string } & { [key: string]: number }

export class MachinePieces {
  static rotors: RotorCollection = {};
  static reflectors: ReflectorCollection = {};
  static translator: Translator = {};
  private constructor () {}
}

//* Generation zone
/**
 * This zones genarates "random" patterns for the rotor connections and reflections
 * feel free to modify the alphabet if you want, or even the seed
 * Just have in mind that the alhpabet must be even.
 */
import { disorder, pickRandom, extractRandom } from '../../utils/functions/random';

// These are the characters accepted by the machine, any other char will be ignored
export const alphabet = 'ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZ'.split(''); // 0123456789!¡¿?()[]{}<>*·|%"/+._,:=\'\\
// This generator is in order to access to a determined convination of rotors
const rotorSeedGenerator = require('random-seed').create('temporalSeed[123]');
// These are the characters accepted by the machine, any other char wont be encrypted correctly
if (alphabet.length % 2 !== 0) 
  throw new Error('Alphabet must have an even length in order for rotors to work: ' + alphabet.length)


// This is so the settings of the machine can have any character of the @alphabet too
const rotors = alphabet.map(() => disorder(alphabet, rotorSeedGenerator.random));

const reflectors = alphabet.map(() => {  // This will make as much reflectors as the amount of characters in the alphabet
  let ref = []
  let copy = [...alphabet]
  for (let i = 0; i < alphabet.length / 2; i++) { // This basically mirrors the value with their index, so if A is in position of Y, then Y will be on the position of A
    const relation = extractRandom(copy, 2, rotorSeedGenerator); // Extracting actually extracts so the array has less letters everytime
    ref[alphabet.indexOf(relation[0])] = relation[1]; // this places exactly the caracters in position with their pair
    ref[alphabet.indexOf(relation[1])] = relation[0];
  }
  return ref; // this is only one reflector, map creates 1 for each alphabet char
});

// Assigning the pieces mapped randomly

alphabet.forEach((v, i) => { // This loop builds a diccionary with Number = Letter and viceversa
  let valueTyped: string | number;
  if ('0123456789'.includes(v)) valueTyped = Number(v);
  else valueTyped = v;
  MachinePieces.translator[valueTyped] = i;
  MachinePieces.translator[i] = valueTyped;
})

rotors.forEach((v, i) => {  // This loops creates objects of drums with their respective Index = Letter
  const name = `X${i + 1}`; //? X because looks like an crossed connetion 🔀, +1 so it starts from X1 to Xn
  MachinePieces.rotors[name] = new Rotor (
    name,
    v.map((l) => Number(MachinePieces.translator[l])), // connections
  );
})

reflectors.forEach((v, i) => {  // This one creates objects of reflectors with their data
  const name = `C${i + 1}`; //? C because looks like a return 🔄, +1 so it starts from C1 ... Cn
  MachinePieces.reflectors[name] = new Reflector (
    name, // Just a development thing for easy reading
    v.map((l) => Number(MachinePieces.translator[l])) // connections
  );
})