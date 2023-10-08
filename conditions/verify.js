const { serverRoleID } = require('../hiddenDir/IDs.json');
module.exports = {
  name: 'VerifyChannelMannager',
  condition({ message }) {
    if (message.channel.name == 'verify') { return true } else { return false };
  },
  async execute({ message }) {
    if (message.content.toLowerCase() !== 'fish') {
      await message.delete();
      return;
    } else if (message.content.toLowerCase() === 'fish') {
      message.delete();
      let sRole = message.guild.roles.resolve(serverRoleID);
      message.member.roles.add(sRole).then(message.author.send('Welcome to ' + message.guild.name));
    }
  }
}