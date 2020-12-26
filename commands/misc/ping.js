const { maxArgs } = require("../help")

module.exports = {
    commands: 'ping',
    description: 'Renvoie la balle',
    minArgs: 0,
    callback: (message, arguments, text) => {
      message.reply('Pong!')
    },
  }