/**
 * Im thinking on creating my own package with own builders so I could just import it from an npm package
 * Maybe it looks like I'm spending too much time on side stuff, but for me it looks cool to learn more things
 * like how it is to create a npm package, or how to code it wiht typescript and declarative typscript (I dont understand too much TS)
 */

const { Embed } = require('discord.js')

interface MessageCommandData {
  name: string | null;
  description: string | null;
  aliases: string[];
  guildOnly: boolean;
  onlyOwner: boolean;
  permissions: string[];
  permissionError: string | null;
  requireRoles: string[];
  minArgs: number;
  maxArgs: number | null;
  mentionChannels: boolean;
  mentionUsers: boolean;
  expectedArgs: string;
  guideEmbed: Embed | null;
}

declare class MessageCommandBuilder {
  public data: MessageCommandData;

  constructor();

  setName(name: string): this;
  setDescription(description: string): this;
  setAliases(...aliases: string[]): this;
  setGuildOnly(value: boolean): this;
  setOnlyOwner(value: boolean): this;
  setPermissions(...permissions: string[]): this;
  setPermissionError(permissionError: string): this;
  setRequireRoles(...requireRoles: string[]): this;
  setMinArgs(minArgs: number): this;
  setMaxArgs(maxArgs: number): this;
  setMentionChannels(mentionChannels: boolean): this;
  setExpectedArgs(expectedArgs: string): this;
  setGuideEmbed(guideEmbed: Embed): this;

  build(): MessageCommandData;
}

module.exports.MessageCommandBuilder = MessageCommandBuilder
// Usage example:
// import { MessageCommandBuilder } from '@discordjs/builders';
// const commandData = new MessageCommandBuilder()
//   .setName('blablabla')
//   .setAliases('bla', 'blabla')
//   .setGuildOnly(true)
//   .setOnlyOwner(false)
//   .build();
