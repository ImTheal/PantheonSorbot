const { maxArgs } = require("../help")

module.exports = {
    commands: 'id',
    description: `donne l'id discord`,
    minArgs: 0,
    callback: (message, arguments, text) => {
      console.log(message.author.id);
    },
  }