function roleAction(member, role, action, message) {
  if (action === 'add') member.roles.add(role).catch(e => message.reply(e.message));
  else if (action === 'remove') member.roles.remove(role).catch(e => message.reply(e.message));
  else if (action === 'toggle') {
    if (member.roles.cache.has(role)) {
      member.roles.remove(role).catch(e => message.reply(e.message));
    } else { member.roles.add(role).catch(e => message.reply(e.message)); }
  }
  else { return 'ERROR: wrong action' };
  return 'Process done';
}
module.exports.roleAction = roleAction;