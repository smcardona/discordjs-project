const { MessageEmbed } = require('discord.js');
const { schematize, calc, simp, trs } = require('../../lib/functions/sumarBins.js');

module.exports = {
  name: 'sumabin',
  aliases: ['sb', 'sumab'],
  description: 'Hace una suma didactica de numeros binarios',
  minArgs: 2,
  maxArgs: null,
  expectedArgs: '[Num1] [Num2] ... <Nums>',
  async execute({ client, message, args, text }) {
    let embed = new MessageEmbed()
      .setDescription(`Numeros: \`${args.join(' + ')}\``)
      .setColor(0x00dd88)
      .setFooter('⬛ = 0      |\t  ⬜ = 1')

    const toS = args || text.split(/+/g); // Input var

    let esquema = schematize(toS, 1); // Makes the schema to be calculated, rotated to the left
    let result = calc(esquema); // Calculates it and returns a single line result
    let binario = simp(schematize(simp(esquema))); // Rotates back the schema to the right so it can be printed

    embed
      .setAuthor('Suma binaria', message.author.displayAvatarURL())
      .addField('Esquema inicial:', '**\u276f** ' + trs(args).join('\n**+ **'))
      .addField('Operado:', '**\u276f** ' + trs(binario).join('\n**+ **'))
      .addField('Resutado:', '**=** ' + trs(result).join(''));


    message.channel.send(embed);


    /* Process
      Calcular el binario maximo
      Llenar los que se quedan cortos con '?'
      Esquemizar los numeros en cuadricula
      Calcular el resultado
      Transforma de nuevo el esquema a elementos leibles => simp(schema(simp(pastSchema
      Traducir a Blanco(1) y negro(0)
    */

  }
};
