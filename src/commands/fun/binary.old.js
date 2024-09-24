const { EmbedBuilder } = require('@discordjs/builders');
const { correctUse } = require('../../libs/functions/correctUse.js');
const { MessageCommandBuilder } = require('../../libs/classes/MessageCommandBuilder.js')

module.exports = {
  data: new MessageCommandBuilder()
    .setName('binary')
    .setDescription('Converts to decimal a binary number')
    .setAliases('bin')
    .setMinArgs(1)
    .setMaxArgs(1)
    .setExpectedArgs('[Binary num.]')
    .build(),

  async execute({ client, message, text, prefix }) {

    const binToDecimal = text => {
      let output = []; let bits = text.length;

      for (let i = 0; i < bits; i++) {
        output.push(text[i] * 2 ** (bits - 1 - i));
      } return output.reduce((a, b) => a + b);
    }

    let entireBin = text.split("");
    if (entireBin.some(e => !['0', '1'].includes(e))) {
      return message.channel.send('This number isn\'t binary\n' +
        correctUse(prefix, this.data.name, this.data.aliases, this.data.expectedArgs));
    }


    let result = binToDecimal(entireBin);

    let embed = new EmbedBuilder()
      .setColor(0x009933)
      .setAuthor({ name: 'From Binary to Decimal', iconURL: message.author.displayAvatarURL() })
      .addFields(
        { name: 'Binary:', value: `\`${text}\``, inline: true },
        { name: 'Decimal:', value: `\`${result}\``, inline: true },
      )
      .setFooter({ text: message.author.username, iconURL: client.user.displayAvatarURL() });

    message.channel.send({ embeds: [embed] });
  }
};