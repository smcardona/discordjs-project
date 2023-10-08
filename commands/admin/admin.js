const { roleAction } = require('../../lib/functions/roleAction.js');
const { staffRoleID } = require('../../OH/IDS.json')
module.exports = {
  name: 'admin',
  aliases: ['ad', 'dc'],
  description: 'Gives and removes admin privileges if u are able to do it',
  guildOnly: true,
  OnlyOwner: true,
  minArgs: 1,
  maxArgs: 2,
  expectedArgs: '[on|off] <User_ID>',
  async execute({ message, args }) {
    const sRole = message.guild.roles.resolve(staffRoleID);
    const toAdm = message.guild.members.resolve(args[1]) || message.mentions.first() || message.member;

    if (args[0].toLowerCase() === 'on') return message.reply(roleAction(toAdm, sRole, 'add', message));
    else if (args[0].toLowerCase() === 'off') return message.reply(roleAction(toAdm, sRole, 'remove', message));
    else { message.reply('You have to specify if i have to turn `ON` or turn `OFF`') };
  }
};