const { homeworkChannel } = require('../config.json');
const connection = require('../database/mongoose-connection');
const { checkHomeworkNameDB, hasRightsOnHomeworkDB, changeHomeworkNameDB } = require("../database/databaseFunction/homeworksFunctions.js");
const { HOMEWORK } = require('../constants/homework');
const { COMMON } = require('../constants/common');

module.exports = {
    commands: 'change-homework-name',
    description: 'Change the name of an existing homework',
    expectedArgs: '<name>',
    permissionError: 'Tu as besoin des droits administrateurs pour executer cette commande',
    minArgs: 1,
    maxArgs: null,
    permissions: '',
    requiredRoles: [],
    callback: async(message, args) => {
        //Accorder la modification d'un nom seulement dans un certain channel
        if (message.channel.id !== homeworkChannel) return;

        try {
            const arguments = args.join(' ').split('] [').map(arg => {
                if (arg.includes('[')) return arg.substring(1);
                else if (arg.includes(']')) return arg.substring(0, arg.length - 1)

                return arg;
            });

            const oldName = arguments[0].toLowerCase();
            const newName = arguments[1].toLowerCase();

            connection.run().then(async() => {
                await checkHomeworkNameDB(oldName)
                    .then(({ _id, _channel }) => {
                        if (!_id) return message.reply(HOMEWORK['HOMEWORK_NOT_FOUND'])

                        hasRightsOnHomeworkDB(message.author.id, _id)
                            .then(hasRights => {
                                if (!hasRights) return message.reply(HOMEWORK['INSUFFICIENT_RIGHTS'])

                                const channel = message.guild.channels.cache.get(_channel);

                                if (channel) channel.setName('DM-' + newName);

                                changeHomeworkNameDB(_id, newName)
                                    .then(res => message.reply(res ? COMMON['SUCCESSFUL_OPERATION'] : COMMON['FAILED_OPERATION']))
                            })
                    })
            })
        } catch (error) {
            message.reply(COMMON['EXPECTED_FORM'] + ' : ' + '=change-homework-name [ancien nom] [nouveau nom]')
        }
    }
}