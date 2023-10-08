const { EmbedBuilder } = require('@discordjs/builders');
const { schematize, calc, simp, trs } = require('../../libs/functions/binAdd.js');
const { MessageCommandBuilder } = require('../../libs/classes/MessageCommandBuilder.js')

module.exports = {
  data: new MessageCommandBuilder()
    .setName('binary-add')
    .setDescription('Makes a dynamic add of multiple binary numbers')
    .setAliases('b+', 'binadd')
    .setMinArgs(2)
    .setExpectedArgs('[Num1] [Num2] ... <Nums>')
    .build(),

  async execute({ message, args, text }) {
    let embed = new EmbedBuilder()
      .setDescription(`Numbers: \`${args.join(' + ')}\``)
      .setColor(0x00dd88)
      .setFooter({ text: '⬛ = 0      |\t  ⬜ = 1' })

    const toS = args || text.split(/\+/g); // Input var

    let esquema = schematize(toS, 1); // Makes the schema to be calculated, rotated to the left
    let result = calc(esquema); // Calculates it and returns a single line result
    let binario = simp(schematize(simp(esquema))); // Rotates back the schema to the right so it can be printed

    embed
      .setAuthor({ name: 'Binary addition', iconURL: message.author.displayAvatarURL() })
      .addFields(
        { name: 'Initial scheme:', value: '**\u276f** ' + trs(args).join('\n**+ **') },
        { name: 'Operated:', value: '**\u276f** ' + trs(binario).join('\n**+ **') },
        { name: 'Result:', value: '**=** ' + trs(result).join('') }
      )


    message.channel.send({ embeds: [embed] });


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
