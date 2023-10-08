const fs = require('node:fs');
const path = require('node:path');

const { REST, Routes } = require('discord.js');

require('dotenv').config()
require('colors')

const { clientId, guildId, token } = process.env

const commands = [];
const categoriesPath = path.join(__dirname, 'commands');

for (const categorie of fs.readdirSync(categoriesPath)) {
  const commandsPath = path.join(__dirname, 'commands', categorie);

  for (const file of fs.readdirSync(commandsPath)) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      commands.push(command.data)
      console.log(`\tDone: ${categorie + '/' + command.data.name}`.green)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`.red);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(token);

// Deploy commands
(async () => {
  try {
    console.log(`\nStarted refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // Catch and log any errors!
    console.error(error);
  }
})();