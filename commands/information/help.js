const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays some help and information about this bot')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The command you want information about')
    ),
  /** @param {ChatInputCommandInteraction} interaction */
  async execute(interaction) {
    const { client } = interaction;

    const informationEmbed = new EmbedBuilder()
      .setTitle('About me')
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setDescription('I\'m a general purpose bot, I am designed to serve you with all my electronical soul.\n' +
        'For that I provide you a list of the functions I can exercise. `' + client.ws.ping + 'ms`')
      .setColor(0x33ddff)


    for (const categorie of client.categories) {
      const categoriePath = path.resolve('./commands/' + categorie)
      informationEmbed.addFields({
        name: categorie.charAt(0).toUpperCase() + categorie.slice(1),
        value: `\`${fs.readdirSync(categoriePath).map(file => file.split('.')[0]).join(', ')}\``
      })
    }

    interaction.reply({ embeds: [informationEmbed] })

  }
}