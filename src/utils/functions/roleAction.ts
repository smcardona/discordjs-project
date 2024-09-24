import { GuildMember, Role } from "discord.js";
import { Message } from "../types/Command";


export function roleAction(member: GuildMember, role: Role, action: string, message: Message) {
  if (action === 'add') member.roles.add(role).catch(e => message.reply(e.message));
  else if (action === 'remove') member.roles.remove(role).catch(e => message.reply(e.message));
  else if (action === 'toggle') {
    if (member.roles.cache.has(role.id)) {
      member.roles.remove(role).catch(e => message.reply(e.message));
    } else { member.roles.add(role).catch(e => message.reply(e.message)); }
  }
  else { return 'ERROR: wrong action' };
  return 'Process done';
}