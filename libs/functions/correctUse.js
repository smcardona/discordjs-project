function correctUse(prefix, command, aliases, expectedArgs) {
  let reply = `\n🔹 The correct use is: **\`${prefix} ${command} ${expectedArgs}\`**`;

  if (aliases.length > 0) {
    reply += `\n🔹 You could also use abreviations:`;

    aliases.forEach((alias) => {
      reply += ` **\`${prefix} ${alias} ${expectedArgs}\`**`;
    });
  }
  return (reply += `\n✅ Extra: **\`[required] <optional>\`**.`);
}
module.exports.correctUse = correctUse;
