const connection = require('../../database/mongoose-connection');
const { addHomeworkToStudentDB } = require("../../database/databaseFunction/homeworksFunctions.js");
const { COMMON } = require('../../constants/common');
const { HOMEWORK } = require('../../constants/homework');

module.exports = (user, homework) => {

    user.send(`Veuillez soumettre le travail ci-dessous pour le devoir ${homework.name}. L'action prendra fin au bout de 5min.`)
        .then(msg => {
            msg.channel.awaitMessages(_ => true, {
                    max: 1,
                    time: 1000 * 5 * 60, //5 minutes
                    errors: ['time']
                })
                .then((response) => {
                    const msg = response.first();

                    //Vérification qu'il s'agit du bon utilisateur
                    if (!msg.author.id === user.id) return;

                    //Vérification du type de la réponse
                    if (!checkAnswerType(msg, homework.type)) return msg.reply(HOMEWORK['WRONG_TYPE_ANSWER'])

                    response.first().reply(HOMEWORK['SUBMIT_HOMEWORK_CONFIRMATION'])
                        .then(m => {
                            m.channel.awaitMessages(_ => true, { max: 1, time: 1000 * 10, errors: ['wrong-answer'] })
                                .then(validationResponse => {
                                    const response = validationResponse.first();

                                    if (response.content.toUpperCase() !== 'Y') return response.reply(HOMEWORK['UNSENT_HOMEWORK'])

                                    connection.run().then(async() => {
                                        addHomeworkToStudentDB({
                                            _member: msg.author.id,
                                            _homework: homework._id,
                                            response: homework.type === 'text' ? msg.content : msg.attachments.first().attachment
                                        })
                                    })

                                    response.reply(HOMEWORK['SENT_HOMEWORK'])
                                })
                        })
                })
                .catch(error => {
                    user.send(COMMON['TIME_ELAPSED']);
                })
        })

}

function checkAnswerType(message, type) {
    if (type === 'text') return message.content.length && !message.attachments.first();

    if (message.attachments.first()) {
        const filename = message.attachments.first().attachment;
        const extension = filename.split('.')[filename.split('.').length - 1];

        return extension === type
    }

    return false;
}