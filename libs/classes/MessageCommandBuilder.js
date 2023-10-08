class MessageCommandBuilder {
  constructor() {
    this.data = {
      isNotSlashCommand: true,
      name: null,
      description: null,
      aliases: [],
      guildOnly: false,
      onlyOwner: false,
      permissions: [],
      permissionError: null,
      requireRoles: [],
      minArgs: 0,
      maxArgs: null,
      mentionChannels: false,
      mentionUsers: false,
      expectedArgs: false,
      guideEmbed: null,
    };
  }

  setName(name) {
    // Validate the name 
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('Name must be a non-empty string');
    }
    this.data.name = name;
    return this;
  }

  setDescription(description) {
    // Validate the description
    if (typeof description !== 'string' || description.length === 0) {
      throw new Error('Description must be a non-empty string')
    }
    this.data.description = description
    return this;
  }

  setAliases() {
    // Validate the alias 
    const aliases = Array.from(arguments)
    if (aliases.some(arg => typeof arg !== 'string')) {
      throw new Error('Aliases must be a non-empty string');
    }
    this.data.aliases = aliases;
    return this;
  }

  setGuildOnly(value) {
    // Validate the value 
    if (typeof value !== 'boolean') {
      throw new Error('GuildOnly must be a boolean');
    }
    this.data.guildOnly = value;
    return this;
  }

  setOnlyOwner(value) {
    // Validate the value 
    if (typeof value !== 'boolean') {
      throw new Error('OnlyOwner must be a boolean');
    }
    this.data.onlyOwner = value;
    return this;
  }

  setPermissions() {
    const permissions = Array.from(...arguments)
    if (permissions.some(perm => typeof perm !== 'string')) {
      throw new Error('Permissions must be only words: Got input ' + perm)
    }
    this.data.permissions = permissions
    return this;
  }

  setPermissionsError(permissionError) {
    if (typeof permissionError !== 'string') {
      throw new Error('PermissionError must be a string')
    }
    this.data.permissionError = permissionError
    return this;
  }

  setRequireRoles() {
    const requireRoles = Array.from(...arguments)
    if (requireRoles.some(role => typeof role !== 'string')) {
      throw new Error('Roles in requiredRoles must be string')
    }
    this.data.requireRoles = requireRoles
    return this;
  }

  setMinArgs(minArgs) {
    if (typeof minArgs !== 'number') {
      throw new Error('MinArgs must be a number')
    }
    this.data.minArgs = minArgs
    return this;
  }

  setMaxArgs(maxArgs) {
    if (typeof maxArgs !== 'number') {
      throw new Error('MinArgs must be a number')
    }
    this.data.maxArgs = maxArgs
    return this;
  }

  setMentionChannels(mentionChannels) {
    if (typeof mentionChannels !== 'boolean') {
      throw new Error('MentionChannels must be a boolean')
    }
    this.data.mentionChannels = mentionChannels
    return this;
  }

  setExpectedArgs(expectedArgs) {
    if (typeof expectedArgs !== 'string') {
      throw new Error('ExpectedArgs must be a string')
    }
    this.data.expectedArgs = expectedArgs
    return this;
  }

  build() {
    // Validate that the required properties are set before building the command
    if (!this.data.name) throw new Error('Name is required');
    if (!this.data.description) throw new Error('Description is required');
    return this.data;
  }
}
/**
 * The way this class works right now make you use the build method to comprove you filled the required atributes
 * and to actually get the data from the return, OR maybe you could use a .data at the end but well .build() will comprove everything
 */

// You can use any that you want XD
module.exports = MessageCommandBuilder
module.exports.MessageCommandBuilder = MessageCommandBuilder


// Usage example:
/* const commandData = new MessageCommandBuilder()
  .setName('blablabla')
  .setAliases('bla', 'blabla')
  .setGuildOnly(true)
  .setOnlyOwner(false) // etc
  .build();
 */
// You can then use `commandData` to create your message command
// and access the properties like `commandData.name`, `commandData.aliases`, etc.
