module.exports = {
  name: "ping",
  aliases: [],
  description: 'Returns a pong',
  minArgs: 0,
  maxArgs: null,
  async execute({ message }) {
    message.reply('Pong!')
  }
}