const ro1 = require('../../lib/objects/enigma/rotores/I.js');
const ro2 = require('../../lib/objects/enigma/rotores/II.js');
const ro3 = require('../../lib/objects/enigma/rotores/III.js');
const ro4 = require('../../lib/objects/enigma/rotores/IV.js');
const ro5 = require('../../lib/objects/enigma/rotores/V.js');
const ro6 = require('../../lib/objects/enigma/rotores/VI.js');
const ro7 = require('../../lib/objects/enigma/rotores/VII.js');
const ro8 = require('../../lib/objects/enigma/rotores/VIII.js');
const reB = require('../../lib/objects/enigma/reflectores/B.js');
const trl = require('../../lib/objects/traductor.js');
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
  async execute(client, message, args, text, prefix) {
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
      let outT = "";
      let rotors = machine.rotors.length;
      for (char of txt) {
        if (char === " ") { outT += " "; continue; };
        let tempL = tr[char];
        for (let i = 0; i < rotors * 2 + 1; i++) {
          let tempR = rotors - (i - rotors);
          if (i === rotors) {
            tempL = machine.reflector[tempL];

            // console.log("REF:", tempR, i, tr[tempL], ": " + tr[machine.reflector[tempL]]);
          } else if (i > rotors) {
            tempL = machine.rotors[tempR].t[tempL];

            // console.log("ROT~:", [tempR], i, tr[tempL], ": " + tempL);
          } else if (i < rotors) {
            tempL = machine.rotors[i].g[tempL];

            // console.log("ROT:", tempR, [i], tr[tempL], ": " + tempL);
          }

          // console.log(char.toUpperCase(), "| " + tr[tempL], ">>", tempR, i + 1);
        }
        // console.log("--------------------");
        outT += tr[tempL];
      }
      return outT;
    };
    message.channel.send(run(inT).toUpperCase());
  }
};