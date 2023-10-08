const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const wait = require('node:timers/promises').setTimeout

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dontpress')
    .setDescription('Dont press the button :O'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('danger')
          .setLabel('Click me!')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('gray')
          .setLabel('Ignore B)')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ content: 'Dont press the button! :O:O:O:O:O:O', components: [row] });

    const filter = i => i.message.interaction.id === interaction.id && i.user.id === interaction.user.id

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', async i => {
      if (i.customId === 'danger') {
        i.deferUpdate();
        await i.deleteReply()
        await interaction.channel.send({ stickers: ["863134268199665674"] })
      }
      else if (i.customId === 'gray') {
        await i.deferUpdate()
        i.editReply('🤓')
        await wait(2000)
        i.deleteReply()
      }
    });
  }
}
