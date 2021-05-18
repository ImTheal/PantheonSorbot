const connection = require('../database/mongoose-connection');
const { checkHomeworkNameDB, hasRightsOnHomeworkDB } = require("../database/databaseFunction/homeworksFunctions.js");
const sendHomeworkAnswers = require('../functionnalities/manual/send-homework-answers');

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
                    if (res) {
                        if (!hasRightsOnHomeworkDB(message.author.id, res._id)) return message.reply('Vous n\'avez pas les droits pour accéder aux réponses de ce devoir');

                        sendHomeworkAnswers(message.author, res._id)
                    } else message.reply('Ce devoir ne semble pas exister pour le moment.');
                })
        })
    }
}