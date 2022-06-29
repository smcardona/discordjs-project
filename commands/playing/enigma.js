const ro1 = require('../../lib/objects/enigma/rotores/I.js');
const ro2 = require('../../lib/objects/enigma/rotores/II.js');
const ro3 = require('../../lib/objects/enigma/rotores/III.js');
const ro4 = require('../../lib/objects/enigma/rotores/IV.js');
const ro5 = require('../../lib/objects/enigma/rotores/V.js');
const ro6 = require('../../lib/objects/enigma/rotores/VI.js');
const ro7 = require('../../lib/objects/enigma/rotores/VII.js');
const ro8 = require('../../lib/objects/enigma/rotores/VIII.js');
const reB = require('../../lib/objects/enigma/reflectores/B.js');
const tr = require('../../lib/objects/traductor.js');
module.exports = {
  name: 'enigma',
  aliases: ['en', 'enc'],
  description: 'Encripta un mensaje dependiendo del programa seleccionado',
  guildOnly: false,
  OnlyOwner: false,
  minArgs: 1,
  maxArgs: null,
  mentionChannels: false,
  mentionUsers: false,
  expectedArgs: '[1 or more words]',
  permissions: [],
  requireRoles: [],
  async execute(client, message, args, text, prefix, test_) {
    /* Que debo hacer?
        D Primero que todo se recibe el mensaje, cada caracter debe procesarse por medio de los rotores
        D Cada rotor tendrá una convinacion aleatoria hecha por mi
        - D El programa default tendra 3 rotores comunes, se pueden añadir diferentes rotores hasta 10, mas son con privilegios
        - D El ultimo rotor devolverá la señal de nuevo a los 3 rotores de forma inversa
        - PPP Cada rotor debe tener un pin programable para que su constante giro sea desde una posicion mas arriba de la anterior
        - PPP Una vez la señal pasa por todos los rotores se dirige al panel donde se podrá llegar a cambiar el resultado de los rotores
            por el resultado al cual se le asigne, como un rotor configurable
        D Los espacios no se codifican
        PPP Los rotores deben girar cada ciclo y girar 1+ el rotor siguiente

    */
    let inT = text.toLowerCase().split(""); // Entrada por ahora no hay programas
    let machine = {
      rotors: [
        ro1,
        ro2,
        ro3
      ],
      reflector: reB,
    };
    function run(txt) {
      let outT = ""; // Output variable
      let rotors = machine.rotors.length; // Amount of rotors that user has
      for (char of txt) { // Iterates all characters even spaces
        if (char === " ") { outT += " "; continue; }; // Doesnt translate spaces
        let tempL = tr[char]; // Translates the letter to number
        for (let j = 0; j < rotors * 2 + 1; j++) { // Cycles trough rotors and reflectors
          let cycles = rotors - Math.abs(j - rotors); // 0, 1, 2, ..n, reflector, n.., 2, 1, 0
          if (j === rotors) { // The middle cycle when we use the reflector
            tempL = machine.reflector[tempL];


            /* console.log("REF:", cycles, j, tr[tempL], ": " + tr[machine.reflector[tempL]]); */
          } else if (j > rotors) { // Turning cycles when the signal is going backwards trough the rotors
            tempL = machine.rotors[cycles].t(tempL);


            /* console.log("ROT~:", [cycles], j, tr[tempL], ": " + tempL); */
          } else if (j < rotors) { // Going cycles when the signal is going forward trough the rotors
            tempL = machine.rotors[cycles].g(tempL);


            /* console.log("ROT:", cycles, [j], tr[tempL], ": " + tempL); */
          }


          /* console.log(char.toUpperCase(), "| " + tr[tempL], ">>", cycles, j + 1); */
        }

        outT += tr[tempL];
      }
      return outT;
    };
    if (test_) {
      let res = run(inT).toUpperCase()
      console.log(res);
      return res;
    }
    message.channel.send(run(inT).toUpperCase());
  }
};

