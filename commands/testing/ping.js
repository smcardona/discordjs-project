module.exports = {
    name: "ping",
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
    async execute(client, message){
        message.reply('Pong!')
    }
}