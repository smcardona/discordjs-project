import { CommandBuilder } from "../../utils/classes/CommandBuilder.js";
import Command from "../../utils/classes/Command.js";
import { CommandInteractionOptionResolver } from "discord.js";

export default new CommandBuilder()
  .setName('user-cache')
  .setDescription('Check if $self or another user is on bots cache')
  .setGuildOnly()
  .setTextChannelOnly()
  .setSlashCommandData(data => data
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user you want to check')
    )
    .addStringOption(option => option
      .setName('user_id')
      .setDescription('The user ID you want to check'))
  )
  .setInteractionExecutor(
    async function ({ interaction, bot }) {
      const userOptionId = interaction.options.getUser('user')?.id || 
        interaction.options.getString('userid') || 
        interaction.user.id;


      const user = bot.users.cache.get(userOptionId);
  
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
        Username: **${user.username}**`,
        ephemeral: true
      })
  
    }
  )
  .build() as Command;