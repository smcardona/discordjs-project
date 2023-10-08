const { prefix, logChannelID } = require('../config');
const commandProcess = require('../libs/commandProcess.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    const logChannel = message.guild.channels.resolve(logChannelID);

    if (message.author.id == client.user.id) return;  // Bucle prevention

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    // Condition listener
    client.conditions.forEach(conditionObj => {
      if (conditionObj.condition({ client, message }) === true) {
        try {
          conditionObj.execute({ client, message });
        } catch (e) {
          logChannel.send(e.message); console.log(e)
        }
      };
    });

    // Inline text command listener
    if (!message.content.toLowerCase().startsWith(prefix)) { return }
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) { return }
    let command = client.commands.get(cmd + '.old');

    if (!command) { command = client.commands.get(client.aliases.get(cmd)) }

    if (command && command.data.isNotSlashCommand) {
      let parameters = { client, message, args, text: args.join(' '), prefix, cmd }
      let normalPrc = commandProcess.bind(command, parameters)

      await normalPrc() && await command.execute(parameters)
        .catch(error => {
          console.log(error);
          return logChannel.send(`
          El error fue **\`${error.message}\`** en el comando **\`${command.name}\`**.
          En el canal <#${message.channel.id}>.
          `);
        })
    }

  }
}