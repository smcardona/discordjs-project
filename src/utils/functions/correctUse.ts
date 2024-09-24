import { Bot } from "../../bot.js";
import { MessageCommand } from "../types/Command.js";
const mainBot = Bot.getBaseInstance(); 

/**
 * Formats a text correctly to show the correct way to use a command
 * @param command Command to show the correct use from
 * @param bot Bot class to extract the prefix from
 */
export function correctUse(command: MessageCommand, bot: Bot = mainBot) {
  let reply = `\n🔹 The correct use is: **\`${bot.config.prefix} ${command.name} ${command.settings.expectedArgs}\`**`;

  const aliases = command.settings.aliases;
  const expectedArgs = command.settings.expectedArgs;
  if (aliases && aliases.length > 0) {
    reply += `\n🔹 You could also use abreviations:`;

    aliases.forEach((alias) => {
      reply += ` **\`${bot.config.prefix} ${alias}${expectedArgs? " "+expectedArgs: ""}\`**`;
    });
  }
  return (reply += `\n✅ Extra: **\`<required> [optional]\`**.`);
}
