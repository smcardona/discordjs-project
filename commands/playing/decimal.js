const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'decimal',
  aliases: ['dec'],
  description: 'Convierte a binario uno o varios numeros decimales',
  minArgs: 1,
  maxArgs: null,
  expectedArgs: '[Num. decimal]',
  async execute({ client, message, text }, _test) {
    let inputs = text.split(' ').map((input) => Math.floor(parseInt(input)))
    let binDigit, output = [];

    inputs.forEach((input, i) => {
      switch (input) {
        case 1: output[i] = '' + 1; break
        case 0: output[i] = '' + 0; break
        default: while (input > 1) {
          binDigit = input % 2
          input = Math.floor(input / 2)
          output[i] = '' + binDigit + (output[i] || '')
        }
          if (input === 1) output[i] = '' + 1 + output[i]
      }
    })
    output = output.join(' ')
    if (_test) return console.log(output)

    const embed = new MessageEmbed()
      .setColor(0x009933)
      .setAuthor('De decimal a binario', message.author.displayAvatarURL())
      .addField('Decimal:', `\`${text}\``, true)
      .addField('Binario:', `\`${output}\``, true)
      .setFooter(message.author.username, client.user.displayAvatarURL());

    message.channel.send(embed);
  }
}