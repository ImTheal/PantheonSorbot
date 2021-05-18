const { homeworkChannel } = require('../config.json');
const connection = require('../database/mongoose-connection');
const { checkHomeworkNameDB, hasRightsOnHomeworkDB, deleteHomeworkDB } = require("../database/databaseFunction/homeworksFunctions.js");


module.exports = {
    commands: 'delete-homework',
    description: 'Delete an homework if it exists',
    expectedArgs: '<name>',
    permissionError: 'Tu as besoin des droits administrateurs pour executer cette commande',
    minArgs: 1,
    maxArgs: null,
    permissions: '',
    requiredRoles: [],
    callback: async(message, args) => {
        if (message.channel.id !== homeworkChannel) return;

        const name = args.join(' ').split('-').join(' ');

        connection.run().then(async() => {
            await checkHomeworkNameDB(name)
                .then(({ _id, _channel }) => {
                    if (!_id) return message.reply('Ce devoir ne semble pas exister.')

                    hasRightsOnHomeworkDB(message.author.id, _id)
                        .then(hasRights => {
                            if (!hasRights) return message.reply('Vous n\'avez pas les droits suffisants pour supprimer ce devoir.')

                            message.reply(`Êtes vous certain de vouloir supprimer le devoir ${name} ? (Y ou N)`)
                                .then(msg => {
                                    msg.channel.awaitMessages(_ => true, { max: 1, time: 1000 * 300 })
                                        .then(response => {
                                            const answer = response.first().content.toUpperCase();

                                            if (answer !== 'Y') return message.reply('L\'opération a été annulée.')

                                            else {
                                                const channel = message.guild.channels.cache.get(_channel);

                                                if (channel) channel.delete();

                                                deleteHomeworkDB(_id).then(res => message.reply(res ? 'L\'opération a réussi.' : 'L\'opération a échoué.'))
                                            }
                                        })
                                })
                        })
                })
        })
    }
}