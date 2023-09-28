const runner = require('../../lib/objects/enigma/pieces.js')

module.exports = {
  name: 'encript',
  aliases: ['en', 'enc'],
  description: 'Encripta / Desencripta un mensaje dependiendo del programa seleccionado',
  minArgs: 1,
  maxArgs: null,
  expectedArgs: '[+1 characters]',
  async execute({ message, text }, _test) {
    /* Que debo hacer?
    PPP : Pending        D : Done          
        D Primero que todo se recibe el mensaje, cada caracter debe procesarse por medio de los rotores
        D Cada rotor tendrá una convinacion aleatoria hecha por mi
        D El programa default tendra 3 rotores comunes, se pueden añadir diferentes rotores hasta 10, más = con privilegios
        D El ultimo rotor devolverá la señal de nuevo a los 3 rotores de forma inversa
        - PPP Cada rotor debe tener un pin programable para que su constante giro sea desde una posicion mas arriba de la anterior [DIFICIL CREO]
        - PPP Una vez la señal pasa por todos los rotores se dirige al panel donde se podrá llegar a cambiar el resultado de los rotores
          por el resultado al cual se le asigne, como un rotor configurable
        D Los espacios no se codifican
        D Los rotores deben girar cada ciclo y girar 1+ el rotor siguiente 
        D Los rotores se podran posicionar y ordenar antes de utilizarse
        - PPP Incorporación de usuarios e instrucciones
        D Contraseñas de desencriptado 
        - PPP La salida del encriptado debe ser dividida en grupos de una cantidad de caracteres aleatoria
        - PPP La salida de un desencriptado debe ser unida y luego remplazar el grupo de letras que simbolicen espacios [DEBO PENSARLO]
        D La maquina puede interpretar numeros y algunos caracteres

    */
    let noset, inT, sets = {};
    if (text.includes('|')) {
      text = text.toUpperCase().split('|') // Separates key from the text to encript
      sets = text.shift().trim().split(/ +/g)
      inT = text[0].trim() // Input Text variable 
      sets = { eng: sets.shift(), pin: sets.shift(), sk: sets.shift(), tk: sets.shift() }
    } else { inT = text.toUpperCase() }

    /* Config schema should be like:
      Sections => '<Used rotors order, last is refl: BACDa> | <Pin sets: TRDC> | [<Start k: KSFT>, <Type k: LKMN>] | text'
      String => 'BACDA TRDC KSFT LKMN | text' // Each character group can be replaced to '*' and system will generate a random setting
      Obj => {
        eng: 'BACDA',
        pin: 'TRDC',  // Its necesary to fill this one although its useless. Im thinking in how it should works, seems hard to program without crashing all 
        sk: 'KSFT',
        tk: 'LKMN', // This should be typed only if you are decrypting, else its recomended to use the '*' to generate a random tk
      }
    */

    // Everything here has been moved to /lib/objects/enigma/pieces.js

    // This line executes whenever the input doesnt includes '|'
    if (sets.eng === undefined) noset = true

    if (_test) {
      let res = runner(inT, sets, noset)
      //console.log(res)
      return res
    }
    message.channel.send(runner(inT, sets, noset))
  }
};

