const {maxArgs} = require("../help")


module.exports = {


    commands: 'addRoles',
    description: `ajoute le(s) role(s) de discord q'un membre possède dans la base`,
    minArgs: 0,
    callback:async (message, arguments, text) => {
        const db = require('../../database/databaseFunction/dbFunctions');
        const libDb = require('../../database/mongoose-connection');
        const memberId = message.member.id.toString();
        libDb.run().then(() => {
            db.getAllRolesFromMemberID(memberId).then(roles => {
                roles.forEach(role =>{
                    const discordRole = message.member.guild.roles.cache.find(discordRole => discordRole.name === role.name);
                    if (discordRole) message.member.roles.add(discordRole);
                })
            })
        })
    },
}