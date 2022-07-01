const { prefix, logChannelID } = require('../../config.js');
const fs = require('fs');
const commandProcess = require('../../lib/commandProcess.js');

module.exports = async (client, message) => {
  const logChannel = message.guild.channels.resolve(logChannelID);

  if (message.author.id == client.user.id) { return; }; // Bucle prevention

  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  // Conditions runner    "event"
  let conditions = fs.readdirSync('./conditions').filter(e => e.endsWith('.js'));
  conditions.forEach(file => {
    file = require(`../../conditions/${file}`);
    if (file.condition({ client, message }) === true) {
      try {
        file.execute({ client, message });
      } catch (e) { logChannel.send(e.message); console.log(e) }
    };
  });

  // Command runner
  if (!message.content.toLowerCase().startsWith(prefix)) { return }
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) { return }
  let command = client.commands.get(cmd);

  if (!command) { command = client.commands.get(client.aliases.get(cmd)) }

  if (command) {
    let parameters = { client, message, args, text: args.join(' '), prefix, cmd }
    let normalPrc = commandProcess.bind(command, parameters);
    await normalPrc().then(await command.execute(parameters))
      .catch(error => {
        console.log(error);
        return logChannel.send(
          `El error fue **\`${error.message}\`** en el comando **\`${command.name}\`**.
			En el canal <#${message.channel.id}>.`);
      })
  }

}
console.log('\nListening messages in Discord');
