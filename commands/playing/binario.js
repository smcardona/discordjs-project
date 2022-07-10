const { MessageEmbed } = require('discord.js');
const convertDigits = text => {
  let o = []; let bits = text.length;
  for (let i = 0; i < bits; i++) {
    o.push(text[i] * 2 ** (bits - 1 - i));
  } return o;
};
const { correctUse } = require('../../lib/functions/correctUse.js');


module.exports = {
  name: 'binario',
  aliases: ['bin'],
  description: 'Convierte a decimal un input binario',
  minArgs: 1,
  maxArgs: null,
  expectedArgs: '[Num. binario]',
  async execute({ client, message, text, prefix }) {

    let entireBin = text.split("");
    if (entireBin.some(e => !['0', '1'].includes(e))) {
      return message.channel.send('Este numero no es binario\n' + correctUse(prefix, this.name, this.aliases, this.expectedArgs));
    }


    let cvtedArray = convertDigits(entireBin);
    let result = cvtedArray.reduce((a, b) => a + b)

    let embed = new MessageEmbed()
      .setColor(0x009933)
      .setAuthor('De binario a decimal', message.author.displayAvatarURL())
      .addField('Binario:', `\`${text}\``, true)
      .addField('Normal:', `\`${result}\``, true)
      .setFooter(message.author.username, client.user.displayAvatarURL());



    message.channel.send(embed);
  }
};