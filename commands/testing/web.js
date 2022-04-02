module.exports = {
  name: 'web',
  aliases: ['page'],
  description: 'This commands sends the webpage of the bot',
  guildOnly: false,
  OnlyOwner: false,
  minArgs: 0,
  maxArgs: null,
  mentionChannels: false,
  mentionUsers: false,
  expectedArgs: '',
  permissions: [],
  requireRoles: [],
  async execute(client, message, args, text, prefix) {
    let URL = 'DELETED URL FOR PRIVACY\n';
    let policy = "This url is private, this should not leave from the server, don't share it\n";
    let status = "This is not working right now, is a void page because its in progress"
    message.channel.send(URL + policy + status)
      .then((msg) => new Promise((res, rej) => {
        setTimeout(() => {
          msg.delete()
          res('Done');
        }, 10000)
      }))
      .catch(console.log);
  }
};