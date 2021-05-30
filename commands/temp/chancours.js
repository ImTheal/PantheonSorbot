module.exports = {
    commands: 'chancours',
    description: '',
    minArgs: 0,
    maxargs: 0,
    expectedArgs: "",
    requiredRoles: '',
    callback: (message, arguments) => {

        message.guild.channels.create('Text', { 
            type: 'text', 
            name: 'truc'
        }).then((chan) => {
            chan.send("Ceci est un nouveau canal ! pour supprimer ce canal, cliquez sur le rond rouge sous ce message")
            .then((msg) => {
                msg.react('🔴')
                const filter = (reaction) => reaction.emoji.name === '🔴' && (reaction.count==2) ;
                const collector = msg.createReactionCollector(filter, { time: 15000 });
                collector.on('collect', r => msg.channel.delete());
            })
        })

        

        
    },
  }
