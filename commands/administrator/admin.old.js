const { roleAction } = require('../../libs/functions/roleAction.js');
const { staffRoleID } = require('../../hiddenDir/IDs.json');
const { MessageCommandBuilder } = require('../../libs/classes/MessageCommandBuilder.js')

module.exports = {
  data: new MessageCommandBuilder()
    .setName('admin')
    .setDescription('Gives and removes admin privileges if you are able to do it')
    .setGuildOnly(true)
    .setOnlyOwner(true)
    .setMinArgs(1)
    .setMaxArgs(2)
    .setExpectedArgs('[on|off] <User>')
    .build(),

  async execute({ message, args }) {
    const sRole = message.guild.roles.resolve(staffRoleID);
    const toAdm = message.guild.members.resolve(args[1]) || message.mentions.members.first() || message.member;

    if (args[0].toLowerCase() === 'on') return message.reply(roleAction(toAdm, sRole, 'add', message));
    else if (args[0].toLowerCase() === 'off') return message.reply(roleAction(toAdm, sRole, 'remove', message));
    else { message.reply('You have to specify if i have to turn `ON` or turn `OFF`') };
  }
}