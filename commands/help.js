const Discord= require("discord.js");
const { types } = require("util");
module.exports = {
  commands: ['help', 'h'],
  description: 'Affiche ce menu',
  minArgs: 0,
  maxArgs: null,
  callback: (message, arguments, argstr, bot) => {
    let msg= new Discord.MessageEmbed()
    .setColor("#ffff00")
    .setTitle("**-- Liste des commandes disponibles ("+bot.commands.array().length+") --**")
    .setFooter("La suite arrive bientôt...")
    for(let com of bot.commands){
      cmd=com[1]
      str= '**';
      (typeof cmd.commands === 'string') ? str+=cmd.commands : str+=cmd.commands[0]
      str+= "** "
      if(cmd.expectedArgs) str+=cmd.expectedArgs
      
      msg.addField(str,cmd.description)


    }
    message.channel.send(msg);
  }
}