module.exports = {
    commands: 'breakout',
    description: '',
    minArgs: 1,
    maxargs: 1,
    expectedArgs: "<nombre de channels>",
    requiredRoles: '',
    callback: (message, arguments) => {


        if(arguments[0]<1 || arguments[0]>30){
            message.channel.send("Vous devez choisir entre 0 et 30 ")
            return
        } 
        
        const Member=message.guild.member(message.author)
        if (Member.voice.channel) { 
            //console.log(`${Member.user.tag} est connecté à  ${Member.voice.channel.name}!`);
            const chan=Member.voice.channel
            tab= new Array();
            for (let index = 0; index < arguments[0]; index++) {
                message.guild.channels.create(chan.name+"-breakout-"+(index+1), { 
                    type: 'voice', 
                })
                .then((el) =>{
                    tab.push(el)
                })

            }

            message.channel.send("Les "+arguments[0]+" breakout rooms ont été créées, pour les supprimer, cliquez sur le rond rouge sous ce message")
            .then((msg) => {
                msg.react('🔴')
                const filter = (reaction) => reaction.emoji.name === '🔴' && (reaction.count==2) ;
                const collector = msg.createReactionCollector(filter, { time: 15000 });
                collector.on('collect', r => {
                    tab.forEach(channelvocal => {
                        if (channelvocal.members.size==0) {
                            channelvocal.delete()
                        }
                        channelvocal.members.forEach(eleve => {
                            eleve.voice.setChannel(chan).then(()=>{
                                channelvocal.delete()
                            })
                        });
                    });
                });

            })



        } else {
            message.channel.send(`Vous n'êtes pas connecté à un channel vocal`);
        };
        // console.log(message.guild.member(message.author).id);
        // console.log(message.author.id);
        // message.guild.channels.create('Text', { 
        //     type: 'text', 
        //     name: 'truc'
        // }).then((chan) => {
        //     chan.send("Ceci est un nouveau canal ! pour supprimer ce canal, cliquez sur le rond rouge sous ce message")
        //     .then((msg) => {
        //         msg.react('🔴')
        //         const filter = (reaction) => reaction.emoji.name === '🔴' && (reaction.count==2) ;
        //         const collector = msg.createReactionCollector(filter, { time: 15000 });
        //         collector.on('collect', r => msg.channel.delete());
        //     })
        // })

        

        
    },
  }
