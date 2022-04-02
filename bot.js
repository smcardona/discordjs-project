const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
const { prefix } = require('./config.js');
require('dotenv').config();

// Discord Section
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const handlers = fs.readdirSync('./handlers').filter((file) => file.endsWith('.js'));

handlers.forEach((file) => {
	console.log(`\nAnalyzing: ${file}\n`);
	require(`./handlers/${file}`)(client);
	console.log(`${file.toUpperCase()} was added.`);
});
console.log('\nPrefix: ' + prefix);

client.login(process.env.TOKEN);