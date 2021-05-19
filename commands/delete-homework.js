const { homeworkChannel } = require('../config.json');
const connection = require('../database/mongoose-connection');
const { checkHomeworkNameDB, hasRightsOnHomeworkDB, deleteHomeworkDB } = require("../database/databaseFunction/homeworksFunctions.js");
const { COMMON } = require('../constants/common');
const { HOMEWORK } = require('../constants/homework');


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
        //Vérifier que l'on est bien dans le bon channel
        if (message.channel.id !== homeworkChannel) return;

        const name = args.join(' ').split('-').join(' ');

        try {
            connection.run().then(async() => {
                await checkHomeworkNameDB(name)
                    .then(({ _id, _channel }) => {
                        if (!_id) return message.reply(HOMEWORK['HOMEWORK_NOT_FOUND'])

                        hasRightsOnHomeworkDB(message.author.id, _id)
                            .then(hasRights => {
                                if (!hasRights) return message.reply(HOMEWORK['INSUFFICIENT_RIGHTS'])

                                message.reply(HOMEWORK['DELETE_HOMEWORK_CONFIRMATION'])
                                    .then(msg => {
                                        msg.channel.awaitMessages(_ => true, { max: 1, time: 1000 * 300 })
                                            .then(response => {
                                                const answer = response.first().content.toUpperCase();

                                                if (answer !== 'Y') return message.reply(COMMON['CANCELED_OPERATION'])

                                                const channel = message.guild.channels.cache.get(_channel);

                                                if (channel) channel.delete();

                                                deleteHomeworkDB(_id).then(res => message.reply(res ? COMMON['SUCCESSFUL_OPERATION'] : COMMON['FAILED_OPERATION.']))
                                            })
                                    })
                            })
                    })
            })
        } catch (error) {
            message.reply(COMMON['CANCELED_OPERATION'])
        }
    }
}