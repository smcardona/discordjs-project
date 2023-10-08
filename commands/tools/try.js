/* This command is for testing and learning only, to try some convination of stuff to see if it just works or nah */
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;


module.exports = {
  data: new SlashCommandBuilder()
    .setName('try')
    .setDescription('Developing only command')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName('args').setDescription('arguments')),
  guildOnly: true,
  async execute(interaction) {
    if (!interaction.inGuild()) {
      return interaction.reply('This command can only be used on guilds')
    }
    interaction.reply('Test')
      .then(i => interaction.followUp('hola'))
      .then(i => 2 + 2)
      .then(i => console.log(i))
      .catch(console.log)
  }
}