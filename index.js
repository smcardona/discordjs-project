// Require the necessary node and npm packages
const fs = require('node:fs');
const path = require('node:path');
require('colors')

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config()
// token variable
const token = process.env.token;

// Bot intentions: Each is what DiscordApp information the client will access to
const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
// Create a new client instance
const client = new Client({ intents });
// Client collections
client.commands = new Collection();
client.aliases = new Collection(); // Aliases means another way to call inline commands [Non slash commands]
client.conditions = new Collection();

// Set categories to a client prop (this is for organization and for command information)
const categoriesPath = path.join(__dirname, 'commands');
client.categories = fs.readdirSync(categoriesPath).filter(cat => cat !== 'hiddenSecret')

// Set command to client collection
console.log('Loading commands')
for (const categorie of client.categories) {
  const commandsPath = path.join(__dirname, 'commands', categorie);
  const commandFiles = fs.readdirSync(commandsPath);

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      command.categorie = categorie;
      const identifier = command.data.isNotSlashCommand ? `${command.data.name}.old` : command.data.name;
      client.commands.set(identifier, command);
      console.log(`\tDone: ${categorie + '/' + identifier}`.green)


      // [Non slash command] Refering aliasses to their commands this is later used on ./events/messageCreat.js
      if (Array.isArray(command.data.aliases) && command.data.aliases.length > 0) {
        command.data.aliases.forEach(alias => {
          client.aliases.set(alias, identifier)
        })
        console.log(`\t\tAKA: ${command.data.aliases.join(' || ')}`.blue)
      }

    } else {
      console.log(`[WARNING] Missing a required property "data" or "execute" from ${file}\n\tAt ${filePath}`.red);
    }
  }
}

// Set conditions to client collection
console.log('Loading conditions')
const conditionPath = path.join(__dirname, 'conditions')
const conditionFiles = fs.readdirSync(conditionPath);
for (const conditionFileName of conditionFiles) {
  const thisFilePath = path.join(conditionPath, conditionFileName);
  const conditionData = require(thisFilePath)
  if ('name' in conditionData && 'condition' in conditionData && 'execute' in conditionData) {
    client.conditions.set(conditionData.name, conditionData)
    console.log(`\tDone: ${conditionData.name}`.green)
  } else {
    console.log(`[WARNING] Missing a required property "name" | "condition" | "execute"\n\tAt ${thisFilePath}`)
  }
}

// Event listener = Listen to events in /events folder and execute whats inside of it
console.log('\nLoading events')
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`\tListening: ${event.name}`.green)
}
// Log in to Discord with your client's token
client.login(token);
