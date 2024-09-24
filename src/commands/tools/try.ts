/* This command is for testing and learning only, to try some convination of stuff to see if it just works or nah */
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { CommandBuilder } from '../../utils/classes/CommandBuilder';
import Command from '../../utils/classes/Command';
const wait = require('node:timers/promises').setTimeout;


export default new CommandBuilder()
  .setName('try')
  .setDescription('Developing only command')
  .setGuildOnly(true)
  .setSlashCommandData( data => data
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option
      .setName('args')
      .setDescription('arguments')
  ))
  .setInteractionExecutor(
    async function ({ interaction }) {
      interaction.reply('Test')
        .then(i => interaction.followUp('hola'))
        .then(i => 2 + 2)
        .then(i => console.log(i))
        .catch(console.log)
    }
  )
  .build() as Command;