const Discord = require('discord.js');
module.exports = {
    commands: 'poll',
    description: 'permet de faire un sondage',
    expectedArgs: "<nombre de propositions>",
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text) => {
        const reponse = new Discord.MessageEmbed()

        const sondeur=message.author
        const nbprop= arguments[0]
        let count=1
        let prop=Array()
        let preg=Array()
        const emojis=['❓','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']
        console.log(nbprop);
        const filter = m => m.author.id==sondeur.id;
        const limit= Number(nbprop)+1

        if (nbprop<2||nbprop>10||isNaN(nbprop)) {
            message.reply("Un sondage ne peut admettre qu'un nombre de propositions compris entre 2 et 10")
                purge()
                return
        }


        const collector = message.channel.createMessageCollector(filter, { time: 120000, max: limit, idle: 30000});
        message.reply("Quelle est votre question ?").then((m)=>{preg.push(m)})
        collector.on('collect', m => {
            if(count-1<nbprop){
                message.reply("Quelle est votre proposition "+count+" ?").then((m)=>{preg.push(m)})
            }
            count++
            prop.push(m)
            m.react('✅')
        });
        collector.on('end', () => {
            if (prop.length<limit) {
                purge()
                return
            }

            purge()

            buildMessage().then((msg)=>{
                message.channel.send(reponse).then((ms) =>{
                    for (let i = 0; i < nbprop; i++) {
                        ms.react(emojis[i+1])
                    }
                })
            })
        });

        function purge(){
            prop.forEach(el => {
                el.delete()
            });
            preg.forEach(el => {
                el.delete()
            });
            message.delete()
        }

        async function buildMessage(ms){
            return new Promise(function(resolve, reject) {
                const cetteHeure = new Date()
                var time = cetteHeure.getHours() + ":" + cetteHeure.getMinutes()
                reponse.setColor('#0099ff')
                .setTitle(prop[0].content)
                .setFooter('sondage créé à '+time+' par '+message.member.displayName);
            
            
                for (let i = 1; i < prop.length; i++) {
                    reponse.addField( emojis[i]+"   "+prop[i].content,'----------------------------------')       
                }
                resolve()
              });
        }

    },
  }