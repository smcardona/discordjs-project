const { EmbedBuilder } = require('@discordjs/builders');
const { schematize, calc, simp, trs, fill, maxDig } = require('../../libs/functions/binAdd.js');
const { MessageCommandBuilder } = require('../../libs/classes/MessageCommandBuilder.js')

module.exports = {
  data: new MessageCommandBuilder()
    .setName('times-bin')
    .setDescription('Makes the multiplication of 2 binary numbers')
    .setAliases('tb', 'mb')
    .setMinArgs(2)
    .setMaxArgs(2)
    .setExpectedArgs('[Num1] [Num2]')
    .build(),

  async execute({ client, message, args, text }) {

    // Takes only the first 2 arguments
    let nums = [args[0], args[1]] || text.split(/\+/g).splice(0, 2);

    let embed = new EmbedBuilder()
      .setDescription(`Numbers: \`${nums.join(' * ')}\``)
      .setColor(0x00dd88)
      .setFooter({ text: '⬛ = 0      |\t  ⬜ = 1' })

    /**
     * Takes 2 binaries as imputs and then organize them to be added
     * @param {Number} nums Input to be calculated for multiplying
     * @returns {Number[]} List of binaries to be added
     */
    const calcRows = nums => {
      fill(nums, maxDig(nums))
      let toBeAdded = []; let ceros = '0';
      // This is the binary that multiplies the one on top
      let belowLine = nums[1].split('');

      // Here does the multiplication
      belowLine.forEach((v, i) => {
        let length = (nums[0].length) + i;

        /* This is to iterate from the last character of the belowLine characters 
        untill the first character -1 is because lists starts with 0 and end with length -1 */
        switch (belowLine[belowLine.length - i - 1]) {
          // IF 1 then add the whole first binary to the Adding queue + fill it with 0 depending iteration
          case '1': toBeAdded.push(nums[0].padEnd(length, '0')); break;
          // IF 0 then just add all 0 to the queue 
          case '0': toBeAdded.push(ceros.padEnd(length, '0')); break;

        }
      })
      return toBeAdded;
    }

    const toBeAdded = calcRows(nums)

    let esquema = schematize(toBeAdded, 1); // Makes the schema to be calculated, rotated to the left
    let result = calc(esquema); // Calculates it and returns a single line result
    let binario = simp(schematize(simp(esquema))); // Rotates back the schema to the right so it can be printed

    embed
      .setAuthor({ name: 'Binary addition', iconURL: message.author.displayAvatarURL() })
      .addFields(
        { name: 'Initial scheme:', value: '**\u276f** ' + trs(nums).join('\n**x **') },
        { name: 'Before Adding:', value: '**\u276f** ' + trs(toBeAdded).join('\n**+ **') },
        // This line is not easy and like there is no way to understand this but it means something for the process ig
        { name: 'Operated:', value: '**\u276f** ' + trs(binario).join('\n**+ **') },
        { name: 'Result:', value: '**=** ' + trs(result).join('') }
      )


    message.channel.send({ embeds: [embed] });

  }
}
