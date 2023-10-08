require('dotenv').config()


/**
 * 
 * @param {Object<Command>} command Comand object wiht data, propierties and execute function
 * @param {Object<InteractionCreate>} interaction Interaction body base
 * @returns {Boolean} False if command cant be executed for some reason or true otherwise
 */
async function handler(command, interaction) {
  const { ownerId } = process.env
  if (command.ownerOnly === true && interaction.user.id !== ownerId) {
    interaction.reply('You are not allowed to run this command')
    return false
  }
  if (command.guildOnly && !interaction.inGuild()) {
    interaction.reply('This command can only be run on guilds')
    return false
  }

  return true
}

module.exports = handler