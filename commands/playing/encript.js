const runner = require('../../lib/objects/enigma/pieces.js')

module.exports = {
  name: 'enigma',
  aliases: ['en', 'enc'],
  description: 'Encripta / Desencripta un mensaje dependiendo del programa seleccionado',
  guildOnly: false,
  OnlyOwner: false,
  minArgs: 1,
  maxArgs: null,
  expectedArgs: '[+1 characters]',
  permissions: [],
  requireRoles: [],
  async execute({ message, text }, test_) {
    /* Que debo hacer?
        D Primero que todo se recibe el mensaje, cada caracter debe procesarse por medio de los rotores
        D Cada rotor tendrá una convinacion aleatoria hecha por mi
        - D El programa default tendra 3 rotores comunes, se pueden añadir diferentes rotores hasta 10, más = con privilegios
        - D El ultimo rotor devolverá la señal de nuevo a los 3 rotores de forma inversa
        - PPP Cada rotor debe tener un pin programable para que su constante giro sea desde una posicion mas arriba de la anterior [DIFICIL CREO]
        - PPP Una vez la señal pasa por todos los rotores se dirige al panel donde se podrá llegar a cambiar el resultado de los rotores
          por el resultado al cual se le asigne, como un rotor configurable
        D Los espacios no se codifican
        D Los rotores deben girar cada ciclo y girar 1+ el rotor siguiente 
        - PPP Los rotores se podran posicionar y ordenar antes de utilizarse
        - PPP Incorporación de usuarios, contraseñas de desencriptado e instrucciones

    */
    let noset, inT, sets = {};
    if (text.includes('|')) {
      text = text.toUpperCase().split('|') // Separates key from the text to encript
      sets = text.shift().trim().split(/ +/g)
      inT = text[0].trim() // Input Text variable 
      sets = { eng: sets.shift(), pin: sets.shift(), sk: sets.shift(), tk: sets.shift() }
    } else { inT = text.toUpperCase() }

    /* Config schema should be like:
      Sections => '[Used rotors order, last is refl: BACDa] | [Pin sets: TRDC] | [[Start k: KSFT], <Type k: LKMN>] | text'
      String => 'BACDA TRDC KSFT LKMN | text'
      Obj => {
        eng: 'BACDA',
        pin: 'TRDC',
        sk: 'KSFT',
        tk: 'LKMN', // This is working how it should but need to make an automatic process to generate passwords
      }
    */

    // Everything here has been moved to /lib/objects/enigma/pieces.js

    if (sets.eng === undefined) noset = true
    // Ill try to make a system to generate passwords to ppl that wants security but are lazy

    if (test_) {
      let res = runner(inT, sets, noset)
      console.log(res)
      return res
    }
    message.channel.send(runner(inT, sets, noset))
  }
};

