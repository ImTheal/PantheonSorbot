const connection = require('../database/mongoose-connection');
const { checkHomeworkNameDB, hasRightsOnHomeworkDB } = require("../database/databaseFunction/homeworksFunctions.js");
const sendHomeworkAnswers = require('../functionnalities/manual/send-homework-answers');
const { HOMEWORK } = require('../constants/homework');

module.exports = {
    commands: 'homework-answers',
    description: 'Gives homework\'s answers if it exists',
    expectedArgs: '<name>',
    permissionError: 'Tu as besoin des droits administrateurs pour executer cette commande',
    minArgs: 1,
    maxArgs: null,
    permissions: '',
    requiredRoles: [],
    callback: async(message, args) => {

        const name = args.join(' ');

        connection.run().then(async() => {
            checkHomeworkNameDB(name)
                .then(res => {
                    //Vérification du nom
                    if (!res)
                        return message.reply(HOMEWORK['HOMEWORK_NOT_FOUND']);

                    //Vérification des droits sur le devoir
                    hasRightsOnHomeworkDB(message.author.id, res._id)
                        .then(hasRights => {
                            if (!hasRights) return message.reply(HOMEWORK['INSUFFICIENT_RIGHTS']);

                            sendHomeworkAnswers(message.author, res._id)
                        })
                })
        })
    }
}