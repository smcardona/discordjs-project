require('dotenv').config()
module.exports = {
    name: 'stop',
    condition(client, message) {
        if (message.content.toLowerCase().startsWith(this.name)) { return true } else { return false }
    },
    async execute(client, message) {
        if (message.content.toLowerCase() != 'stop 0000') { return message.reply('Wrong Password'); };
        if (message.author.id == process.env.OwnerId) {
            throw new Error("############ BOT STOPPED ############");
        }
    }
};