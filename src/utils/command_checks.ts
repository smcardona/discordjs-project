
import { ownersId } from '../config';
import { correctUse } from './functions/correctUse';
import Command from './classes/Command';
import { MessageCommand, SlashCommand, Message } from "./types/Command";
import { Bot } from '../bot';
import { CommandInteraction, PermissionResolvable, User, Message as DiscordMessage, TextChannel, GuildMemberRoleManager } from 'discord.js';
/**
 * This function validates the message content in reference to the command that the message called
 * @param command Command to have as reference to validate the message
 * @param bot Bot instance
 * @param message Message instance
 * @param args Content of the message separated by spaces and withouth the prefix and the command
 */
export function messageCommandCheck (
  { command: cmd, message, args, bot }:
  { command: MessageCommand, message: Message, args: string[], bot: Bot}
): boolean {

  if (!cmd.settings) return true;
  // expectedArgs Propierties
  const minArgs = cmd.settings.minArgs ?? 0;
  const maxArgs = cmd.settings.maxArgs ?? 2000; // 2000 as max args a command can have idk
  const mentionChannels = cmd.settings.mentionChannels ?? false;
  const mentionUsers = cmd.settings.mentionUsers ?? false;
  const expectedArgs = cmd.settings.expectedArgs;
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
    if (mentionUsers && (!message.guild?.members.resolve(args[0]))) {
      reply = `you must mention or say a user ID`;
    };
    // <> [] expected
    if (expectedArgs) {
      reply += correctUse(cmd, bot);
    }
    // Final Reply
    message.reply(`${message.author.username}, ` + reply);
    return false;
  }
  return true;
  // Things to add: testing command to test another command. DIFICULTY: HARD
}

/**
 * This function validates the data content in reference to the command that the interaction called
 * @param command Command to have as reference to validate the message
 * @param bot Bot instance
 * @param message Message instance
 * @param args Content of the message separated by spaces and withouth the prefix and the command
 */
export function commandCheck (
  { command: cmd, reference: ref } :
  { command: Command, reference: CommandInteraction | DiscordMessage, bot: Bot }
): boolean {

  // Compatibility settings
  let author: User;
  if ((ref instanceof CommandInteraction)) {
    author = ref.user;
  }
  else if (ref instanceof DiscordMessage) {
    author = ref.author;
  }
  else return false; // not message nor interaction
  
  // Filters bots
  if (author.bot) return false;

  // onlyOwner Property
  const onlyOwner = cmd.settings?.onlyOwner;
  if (onlyOwner && !ownersId.includes(author.id)) {
    ref.reply(`**${author.username}**, you can't use this command.`);
    return false;
  }
  
  // guildOnly Commands
  const guildOnly = cmd.settings?.guildOnly;
  
  if(guildOnly) {
    
    // first check its in guild
    if(!ref.inGuild()) {
      ref.reply(`This command only works on Guilds`);
      return false;
    }

    // now checks the rest of the settings
    const textChannelOnly = cmd.settings?.textChannelOnly;
    const permissions = cmd.settings?.permissions || [];
    const requiredRoles = cmd.settings?.requiredRoles || [];
    //* textChannelOnly
    if (textChannelOnly && !(ref.channel instanceof TextChannel)) {
      ref.reply(`This command only works on Text Channels from guilds`);
      return false;
    }
    //* owners bypass
    if (
      permissions.length || requiredRoles.length 
      && !ownersId.includes(author.id) // custom filter to bypass bot owners from these restrictions
    ) {
  
      //* permissionError 
      let permissionError = cmd.settings?.permissionError;
      if (!permissionError) { // Makes a default permission Error if there is not one defined
        permissionError = `you dont have the permissions: **${permissions.join(', ').toLowerCase()
          .replace('_', ' ')}** to use this command.`;
      }
      //* permissions
      for (const permission of permissions) {
        if (!ref.guild?.members.cache.get(author.id)!
            .permissions.has(permission as PermissionResolvable))
  
          ref.reply(`**${author.username}**, ${permissionError}`);
          return false;
      }
      //* requiredRoles
      for (const requiredRole of requiredRoles) {
        // somehow roles could be string[] or MemberRoleManager cz raw and cached types
        const hasRole = 
          ref.member?.roles instanceof GuildMemberRoleManager ?
            ref.member.roles.cache.has (requiredRole) : 
            ref.member?.roles.includes  (requiredRole) ;
        
        const role = ref.guild?.roles.resolve(requiredRole);
  
        if (!role || !ref.guild?.roles.cache.has(requiredRole)) throw new Error(
          "Couldn't find the resolvable role to check role requirements for the command: "+cmd.name
        );
  
        if (!hasRole){
          ref.reply(`**You must have the **${role.name}** role to use this command.`);
          return false;
        }
      }

    }
  
  }

  // Passed all the checks
  return true;
}

/**
 * This function validates the interaction data doesnt
 * @param command Command to have as reference to validate the message
 * @param bot Bot instance
 * @param interaction Message instance
 * @param args Content of the message separated by spaces and withouth the prefix and the command
 */
export function slashCommandCheck (
  {  } :
  { command: SlashCommand, interaction: CommandInteraction, bot: Bot }
): boolean {

  // FOR NOW SLASH COMMANDS DONT HAVE A CUSTOM FILTER FOR ONLY THEM. THEY COULD HAVE HYBRID COMMAND FILTERS
  // todo: MAYBE CHECKS FOR CONTEXT INTERACTIONS
  // guildOnly?: boolean,          // hybrid
  // onlyOwner?: boolean,          // hybrid
  // permissions?: string[],       // hybrid
  // permissionError?: string,     // hybrid
  // requiredRoles?: string[],     // hybrid
  return true;
}
