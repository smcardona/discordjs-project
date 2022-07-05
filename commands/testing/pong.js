module.exports = {
  name: 'pong',
  aliases: [],
  description: 'Returns a ping',
  minArgs: 0,
  maxArgs: null,
  async execute({ message }) {
    message.reply('Ping!')
  }
};