import { alphabet, EnigmaMachine, MachineConfig, MachinePieces } from '../../utils/classes/EnigmaMachine';
import { CommandBuilder } from '../../utils/classes/CommandBuilder';
import Command from '../../utils/classes/Command.js';

export default new CommandBuilder()
  .setName('enigma')
  .setDescription('Encrypt | Decrypt messages provided with the configuration given')
  .setAliases('en')
  .setMinArgs(1)
  .setExpectedArgs('[Configuration] | <Text to encrypt>`\nPossible characters: ```' + alphabet.join("") + "````")
  .setSlashCommandData(data => data
    .addStringOption(opt => opt
      .setName("text")
      .setDescription("Text that you wanna either encrypt or decrypt")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("config")
      .setDescription("Custom config for your machine")
      .setRequired(false)
    )
  )
  .setMessageExecutor(
    async function ({ message, text }, _test) {
      message = await message.reply("Processing");

      let config: Partial<MachineConfig> = {};
      let toEncrypt: string;

      if (text.includes('|')) {
        const [configString, ...rest] = text.split('|');
        config.toString = configString.trim();
        toEncrypt = rest.join('|').trim();
        config = configFromString(config.toString);
      } else {
        toEncrypt = text;
      } // No | means basic default config


      const result = processInput(toEncrypt, config, _test)
      if (_test) return result;

      message.edit(result);
    }
  )
  .setInteractionExecutor(
    async function ({ interaction }, _test) {
      await interaction.deferReply();

      let config: Partial<MachineConfig> = {};
      const toEncrypt = interaction.options.get("text")?.value as string;

      const configOptions = interaction.options.get("config")?.value as string;
      if (configOptions) { config = configFromString(configOptions) }

      const result = processInput(toEncrypt, config, _test)
      if (_test) return result;

      await interaction.editReply(result);
    }
  )
  .build() as Command;
// guideEmbed: "comming soon"  Planing to add a guide in embed format with instructions and samples on how to use this command

/**
 * Transform a string into a machine config
 * @param configString A valid string tha represents a machine config
 * @description A valid string should have this structure: `<ENGINES> <PINS> <INITIAL_POS> [PASSWORD]`.
 * These fields must be letters of the alphabet or * to mean random
*/
const configFromString = (configString: string): MachineConfig => {
  const configParts = configString.toUpperCase().split(/ +/g);
  return {
    engines: configParts[0],
    pins: configParts[1],
    initialPosition: configParts[2],
    password: configParts[3],
    toString: configString
  }
}

const processInput = (toEncrypt: string, config: Partial<MachineConfig>, _test?: boolean) => {

  const MACHINE = new EnigmaMachine(config);

  return MACHINE.run(toEncrypt, (_test ? { textOnly: true } : undefined));
}

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