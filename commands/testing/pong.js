module.exports = {
    name: 'pong',
    aliases: [],
    description: '',
    guildOnly: false,
    OnlyOwner: false,
    minArgs: 0,
    maxArgs: null,
    mentionChannels: false,
    mentionUsers: false,
    expectedArgs: '',
    permissions: [],
    requireRoles: [],
    async execute({ message }) {
        message.reply('Ping!')
    }
};