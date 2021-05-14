const mongoose = require("mongoose");
const Discord = require("discord.js");
const {maxArgs} = require("../help")


module.exports = {


    commands: 'appel',
    description: `ajoute les channels par rapport à la base`,
    minArgs: 0,
    callback: async (message, arguments, text) => {
        const db = require('../../database/databaseFunction/dbFunctions');
        const libDb = require('../../database/mongoose-connection');
        const guild = message.member.guild;


        /*
        s'il y a un cours actuellement OK
        verfier si c'est bien le prof qui fait l'appel ok
        get group ok
        get élèves (idDiscord)
        comparaison du voice channel par rapport à la liste des idDiscord
        faire un message avec la liste des élèves avec oui ou non
        envoyer le messsage
         */
        const Member = message.member;
        const subjectName = message.channel.name;
        const roleName = message.channel.parent.name;

        libDb.run().then(() => {
            db.isClassNow(roleName, subjectName).then(value => {
                db.isTheProf(value.prof, message.member.id).then(prof => {
                    if (prof) {
                        if (Member.voice.channel) { // Checking if the member is connected to a VoiceChannel.
                            const voiceChannel = Member.voice.channel;
                            const now = new Date(Date.now());
                            const messageAppel = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('Appel du cours de ' + subjectName)
                                .setAuthor(`Enseignant : ` + prof.firstname + ' ' + prof.lastname)
                                .setDescription('du ' + now.toLocaleString("fr-FR", {timeZone: "Europe/Paris"}))
                                .setTimestamp()
                                .setFooter(`Fin de l'appel`);


                            db.getAllMembersFromRole(roleName).then(async students => {
                                let liste = '';
                                const map = voiceChannel.members;
                                for (const student of students) {
                                    const name = student.firstname + ' ' + student.lastname;
                                    if (map.has(student.idDiscord)) {
                                        liste = liste.concat(':ballot_box_with_check: ' + name + '\n')
                                    } else {
                                        liste = liste.concat(':a: ' + name + '\n')
                                    }
                                }
                                messageAppel.addFields(
                                    {name: `Liste d'appel : `, value: liste}
                                )
                                await message.channel.send(messageAppel);
                            })
                        } else {
                            console.log("non connectée sur un voice channel")
                        }
                    }
                })


            })
        })


    },
}