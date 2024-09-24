import { ApplicationCommand } from "discord.js";
import { Bot } from "../../bot.js";

export function resolveSlashCommand (bot: Bot, { name, id }: { name?: string, id?: string}) {
  let toResolve: ApplicationCommand | undefined;

  if (id) 
    toResolve = bot.application?.commands.cache.find(cmd => cmd.id == id);

  if (name) 
    toResolve = bot.application!.commands.cache.find(cmd => cmd.name == name);

  return toResolve ? `</${toResolve.name}:${toResolve.id}>`: "/NOT_FOUND";
  
  
  
}