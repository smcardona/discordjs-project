/**
 * This is the process executed when there is a command in the 'message' event its just to make the message event cleaner
 * @param {Object} client Client resolved
 * @param {Object} message Message resolved
 * @param {Array} args Content of the message separated by spaces and withouth the prefix and the command
 * @param {String} text Content of the message withouth the prefix and the command
 * @param {String} prefix The prefix
 * @param {String} cmd The command used in String version
 * @param {Object} opts Diferent options for the command [NOT YET]
 * @this {Object} Should be the command object binded.
 */
const { ownersId } = require('../config');
const { validatePermissions } = require('./functions/validatePermissions.js');
const { correctUse } = require('./functions/correctUse.js');

module.exports = async function ({ message, args, prefix }) {
  if (message.author.bot) { return; } // Bots arent allowed to use these commands
  // guildOnly Property
  const guildOnly = this.data.guildOnly && true;
  if (guildOnly && !message.guild) {
    return message.reply(`**${message.author.username}**, this command only works in a server.`);
  }
  // onlyOwner Property
  const onlyOwner = this.data.onlyOwner && true;
  if (onlyOwner && !ownersId.includes(message.author.id)) {
    return message.channel.send(`**${message.author.username}**, you can't use this command.`);
  }
  // permissions Property Node Validation
  const permissions = this.data.permissions || [];
  if (permissions.length) {
    if (typeof permissions === 'string') { permissions = [permissions] } validatePermissions(permissions);
  }

  if (!ownersId.includes(message.author.id) || true) { // This conditional is just my permission bypass
    let permissionError = this.data.permissionError;
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
    const requireRoles = this.data.requireRoles || [];
    for (const requireRole of requireRoles) {
      const hasRole = message.member.roles.cache.has(requireRole);
      const role = message.guild.roles.resolve(requireRole);

      if (!hasRole || !message.guild.roles.cache.has(requireRole))
        return message.channel.send(`**${message.author.username}**, you must have the **${role.name}** role to use thi command.`);
    }
  }
  // expectedArgs Propierties
  const minArgs = this.data.minArgs;
  const maxArgs = this.data.maxArgs;
  const mentionChannels = this.data.mentionChannels;
  const mentionUsers = this.data.mentionUsers;
  const expectedArgs = this.data.expectedArgs;
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
      reply += correctUse(prefix, this.data.name, this.data.aliases, this.data.expectedArgs);
    }
    // Final Reply
    message.channel.send(`${message.author.username}, ` + reply);
    return false
  }
  return true
  // Things to add: testing command to test another command

}
