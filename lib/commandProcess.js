/**
 * This is the process executed when there is a command in the 'message' event its just to make the message event cleaner
 * @param {Object} client Client resolved
 * @param {Object} message Message resolved
 * @param {Array} args Content of the message separated by spaces and withouth the prefix and the command
 * @param {String} text Content of the message withouth the prefix and the command
 * @param {String} prefix The prefix
 * @param {String} cmd The command in String version
 * @param {Object} opts Diferent options for the command [NOT YET]
 * @this {Object} Should be the command object binded.
 */
const Discord = require('discord.js');
const { prefix, OwnersID, logChannelID } = require('../config.js');
const { validatePermissions } = require('./functions/validatePermissions.js');
const { correctUse } = require('./functions/correctUse');

module.exports = async function (client, message, args, text, prefix, cmd, opts) {
  if (message.author.bot) { return; } // Bucle prevention and bugs
  // GuildOnly Property
  const GuildOnly = this.GuildOnly && true;
  if (GuildOnly) {
    if (!message.guild)
      return message.reply(`**${message.author.username}**, this command only works in a server.`);
  }
  // OnlyOwner Property
  const OnlyOwner = this.OnlyOwner && true;
  if (OnlyOwner) {
    if (!OwnersID.includes(message.author.id))
      return message.channel.send(`**${message.author.username}**, you can't use this command.`);
  }
  // permissions Property Node Validation
  const permissions = this.permissions;
  if (permissions.length) {
    if (typeof permissions === 'string') { permissions = [permissions] } validatePermissions(permissions);
  }
  // Owner Bypass
  if (!OwnersID.includes(message.author.id)) {
    let permissionError = this.permissionError;
    if (permissionError === undefined) { // Makes a default permission Error if there is not one defined
      permissionError = `you dont have the permissions: **${permissions.join(', ').toLowerCase()
        .replace('_', ' ')}** to use this command.`;
    }
    // userPermissions Validation
    for (const permission of permissions) {
      if (!message.guild.members.cache.get(message.author.id).permissions.has(permission))
        return message.channel.send(`**${message.author.username}**, ${permissionError}`);
    }
    // userRoles Validation
    const requireRoles = this.requireRoles;
    for (const requireRole of requireRoles) {
      const hasRole = message.member.roles.cache.has(requireRole);
      const role = message.guild.roles.resolve(requireRole);

      if (!hasRole || !message.guild.roles.cache.has(requireRole))
        return message.channel.send(`**${message.author.username}**, you must have the **${role.name}** role to use thi command.`);
    }
  }
  // expectedArgs Propierties
  const minArgs = this.minArgs;
  const maxArgs = this.maxArgs;
  const mentionChannels = this.mentionChannels;
  const mentionUsers = this.mentionUsers;
  const expectedArgs = this.expectedArgs;
  if (
    args.length < minArgs ||
    (args.length > maxArgs && maxArgs !== null) ||
    (message.mentions.channels.size === 0 && mentionChannels) ||
    (message.mentions.users.size === 0 && mentionUsers)
  ) {
    let reply;
    // args.length
    if (args.length > maxArgs) { reply = `you gave me so many arguments.\nThey should be maximum ${maxArgs}` };
    if (args.length < minArgs) { reply = `you didn't give me enough arguments.\nThey should be at least ${minArgs}` };
    // mentionChannels
    if (mentionChannels) { reply = `you must mention a channel` };
    // mention Users
    if (mentionUsers && (!message.guild.members.resolve(args[0]))) {
      reply = `you must mention or say a user ID`;
    };
    // [] <> expected
    if (expectedArgs) {
      reply += correctUse(prefix, this.name, this.aliases, this.expectedArgs);
    }
    // Final Reply
    return message.channel.send(`${message.author.username}, ` + reply);
  }

  // Things to improve: testing command to test another command

}
