import { Events, BaseInteraction } from 'discord.js'
import { Bot } from '../bot';
import { commandCheck, slashCommandCheck } from '../utils/command_checks'
import { Event } from '../utils/types/Events';
import { SlashCommand } from '../utils/types/Command';

export default {
  name: Events.InteractionCreate,
  async execute(bot: Bot, interaction: BaseInteraction) {

    // todo: maybe make a zone to handle other kind of interacions



    // commandInteractionOnly zone
    if (!interaction.isCommand()) return;

    let command = bot.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply('The command wasn\'t found, there is a problem right with commands that were added by accident\nPlease be patient and try antother command')
      return console.error(`No command named "${interaction.commandName}" was found.`)
    }

    if (!command.interactionExecute){
      interaction.reply("There was an error trying to execute this command. Please communicate this to a developer")
      return console.error(`No executor found on "${command.name}"`)
    }
 
    try {
      // Verify the command properties to match with the command requeriments (permissions, roles, guildOnly, etc)
      const pass: boolean = 
        commandCheck({ command, reference: interaction, bot }) &&
        slashCommandCheck({ command: command as SlashCommand, interaction, bot })
  
      if (!pass) return;

      await command.interactionExecute({ interaction, bot });
    } catch (error) {
      console.error(`Error executing /${interaction.commandName}`);
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
} as Event;