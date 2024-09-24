import { Events } from 'discord.js';
import { serverRoleID } from '../../hidden_config/IDs.json';
import { Trigger } from '../../utils/types/Triggers';

export default {
  name: 'verify-user',
  event: Events.MessageCreate,
  conditionCheck: (bot, message) => message.channel.name == 'verify'
  ,
  async execute(bot, message) {
    if (message.content.toLowerCase() !== 'fish') {
      await message.delete();
      return;
    } else if (message.content.toLowerCase() === 'fish') {
      message.delete();
      let sRole = message.guild.roles.resolve(serverRoleID);
      message.member.roles.add(sRole).then(message.author.send('Welcome to ' + message.guild.name));
    }
  }
} as Trigger;