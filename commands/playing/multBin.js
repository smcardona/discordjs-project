// const { MessageEmbed } = require('discord.js');
const prcS = require('../../lib/functions/sumarBins.js');


module.exports = {
  name: 'mulbin',
  aliases: ['mb', 'mulb'],
  description: 'Hace una multiplicación didactica de dos numeros binarios',
  onlyOwner: true, // COMMAND ON DEVELOPMENT
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: '[Num1] [Num2]',
  async execute({ client, message, args, text }) {
    let nums = [args[0], args[1]] || text.split(/+/g).splice(0, 2);

    const calc = nums => {
      prcS.fill(nums, prcS.maxRt(nums))
      let toS = []; let ceros = '0';
      let bLine = nums[1].split('');
      bLine.forEach((v, i) => {
        let length = (nums[0].length) + i;
        switch (v) {
          case '1': toS.push(nums[0].padEnd(length, '0')); break;
          case '0': toS.push(ceros.padEnd(length, '0')); break;
          case undefined: break;
        }
      });
      return toS;
    }

    console.dir(prcS.trs(prc.fill(calc)));

  }
}