const mongoose = require("mongoose");
const {maxArgs} = require("../help")


module.exports = {


    commands: 'updateChannel',
    description: `ajoute les channels par rapport à la base`,
    minArgs: 0,
    callback: async (message, arguments, text) => {
        const db = require('../../database/databaseFunction/dbFunctions');
        const libDb = require('../../database/mongoose-connection');
        const memberId = message.member.id.toString();

        function getClasses(role) {
            return new Promise(resolve => {
                let promises = [];
                role.calendar.forEach(value => {
                    const _id = mongoose.Types.ObjectId(value);
                    promises.push(db.getClassById(_id));
                })
                Promise.all(promises).then(values => {
                    resolve(values);
                })
            })
        }

        function getSujects(res) {
            let sujects = [];
            sujects.push(`général`);
            sujects.push(`aléatoire`);
            res.forEach(element => {
                if (sujects.indexOf(element.subject) === -1) {
                    sujects.push(element.subject);
                }
            })
            return sujects;
        }

        libDb.run().then(() => {
                db.getAllRolesFromMemberID(memberId).then(roles => {
                    roles.forEach(async (role) => {
                        const {Permissions} = require('discord.js');
                        const discordRole = message.member.guild.roles.cache.find(discordRole => discordRole.name === role.name);
                        const categoryChannels = message.guild.channels.cache.filter(channel => channel.type === "category");
                        const firstWord = role.name.substr(0, role.name.indexOf(" "));
                        const everyoneDeny = new Permissions(1024);
                        const roleAllow = new Permissions(1049600);
                        let roleCategory = categoryChannels.find(channel => channel.name === firstWord);
                        if (!roleCategory) {
                            await message.guild.channels.create(firstWord, {
                                type: 'category',
                                permissionOverwrites: [
                                    {
                                        id: message.guild.roles.everyone,
                                        deny: everyoneDeny
                                    },
                                    {
                                        id: discordRole,
                                        allow: roleAllow
                                    }
                                ]
                            }).then(value => {
                                roleCategory = value;
                            })
                        }
                        getClasses(role).then(async (res) => {
                            const subjects = await getSujects(res);
                            const textChannels = message.guild.channels.cache.filter(channel => channel.type === "text");
                            subjects.forEach(subject =>{
                                console.log(subject)
                                const subjectChannel = textChannels.find(channel => {
                                    if (channel.name === subject &&
                                    channel.parentID === roleCategory.id) return true;
                                });
                                if (subjectChannel === undefined){
                                    message.guild.channels.create(subject, {
                                        type: 'text',
                                        parent: roleCategory.id
                                    })
                                }
                            })
                        })

                    })
                })
            }
        )
    },
}