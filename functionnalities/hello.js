const Discord= require("discord.js");
module.exports= (bot) =>{
    bot.on('message',message =>{
        if(includesRealy(message,'hello')){
            message.channel.send("Salut "+message.author.username+" !");
        }
    });

    function includesRealy(msg,str){
        let msg2=msg.content.toUpperCase();
        return(
          msg2.includes(str.toUpperCase())
        )
    }
}