const { SlashCommandBuilder, BaseInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user-cache')
    .setDescription('Check if $self or another user is on bots cache')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to check')
    )
    .addStringOption(option =>
      option
        .setName('userid')
        .setDescription('The user ID you want to check')),

  /**
   * 
   * @param {BaseInteraction} interaction 
   */
  async execute(interaction) {
    const userOptionId = interaction.options.getUser('user')?.id || interaction.options.getString('userid') || interaction.user.id;
    const user = interaction.guild.members.resolve(userOptionId);

    if (!user) {
      return interaction.reply({
        content: 'There was no user found with the ID ' + userOptionId,
        ephemeral: true
      })
    }

    return interaction.reply({
      content: `The user privided was found successfully ✔
      The user provided was ${user}
      ID: **${user.id}**
      Username: **${user.user.username}**`,
      ephemeral: true
    })


  }
}