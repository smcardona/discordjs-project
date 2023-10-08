require('dotenv').config()
module.exports = {
  name: '!stop',
  condition({ message }) {
    if (message.content.toLowerCase().startsWith(this.name)) { return true } else { return false }
  },
  async execute({ message }) {
    if (message.content.toLowerCase() != '!stop 0000') { return message.reply('Wrong Password'); };
    if (message.author.id == process.env.ownerId) {
      throw new Error("############ BOT STOPPED ############");
    }
  }
};