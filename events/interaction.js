const { Events, BaseInteraction } = require('discord.js');
const handle = require('../libs/handlers/commandHandler')

module.exports = {
  name: Events.InteractionCreate,
  /** @param {BaseInteraction} interaction */
  async execute(interaction) {

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply('The command wasn\'t found, there is a problem right with commands that were added by accident\nPlease be patient and try antother command')
      return console.error(`No command matching ${interaction.commandName} was found.`)
    }

    // Verify the command properties to match with the command requeriments (permissions, roles, args, etc)
    const pass = await handle(command, interaction)
    if (!pass) return console.log()

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};