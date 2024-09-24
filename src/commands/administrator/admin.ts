import { roleAction } from '../../utils/functions/roleAction';
import { staffRoleID } from '../../hidden_config/IDs.json';
import { CommandBuilder } from '../../utils/classes/CommandBuilder';
import Command from '../../utils/classes/Command';

export default new CommandBuilder()
    .setName('admin')
    .setDescription('Gives and removes admin privileges if you are able to do it')
    .setGuildOnly(true)
    .setOnlyOwner(true)
    .setMinArgs(1)
    .setMaxArgs(2)
    .setExpectedArgs('<on|off> [User]')
    .setMessageExecutor(
      async function ({ message, args }) {
        const sRole = message.guild!.roles.resolve(staffRoleID);
        const toAdm = message.guild!.members.resolve(args[1]) ?? message.mentions.members?.first() ?? message.member;

        if (!sRole) return message.reply('Error: Couldnt find the admin role to add');
        if (!toAdm) return message.reply('Error: Couldnt find any member somehow. Including you.');

        if (args[0].toLowerCase() === 'on') return message.reply(roleAction(toAdm, sRole, 'add', message));
        else if (args[0].toLowerCase() === 'off') return message.reply(roleAction(toAdm, sRole, 'remove', message));
        else { message.reply('You have to specify if i have to turn `ON` or turn `OFF`') };
      }
    )
    .build() as Command;

  