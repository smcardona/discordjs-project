const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Replies with your input!')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to say')
        .setRequired(true)
        .setMaxLength(1000))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send the message')
        .addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;
    channel.send(message)
    await interaction.reply({ content: 'done', ephemeral: true })
    await wait(2000)
    interaction.deleteReply()

  }
}
