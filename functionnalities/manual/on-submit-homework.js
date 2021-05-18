const connection = require('../../database/mongoose-connection');
const { addHomeworkToStudentDB } = require("../../database/databaseFunction/homeworksFunctions.js");

const checkAnswerType = (message, type) => {
    if (type === 'text') return message.content.length && !message.attachments.first();

    if (message.attachments.first()) {
        const filename = message.attachments.first().attachment;
        const extension = filename.split('.')[filename.split('.').length - 1];

        return extension === type
    }

    return false;
}

module.exports = (user, homework) => {
    user.send(`Veuillez soumettre le travail ci-dessous pour le devoir ${homework.name}. L'action pendra fin au bout de 5min.`)
        .then(msg => {
            const answerFilter = _ => true;
            msg.channel.awaitMessages(answerFilter, {
                    max: 1,
                    time: 1000 * 5 * 60,
                    errors: ['time']
                })
                .then((response) => {
                    const msg = response.first();
                    if (msg.author.id === user.id) {
                        if (checkAnswerType(msg, homework.type)) {
                            response.first().reply('Êtes vous sûr de remettre ce travail (Y or N) ? L\'action est irreversible.')
                                .then(m => {
                                    validationFilter = message => ['Y', 'N'].includes(message.content.toUpperCase());
                                    m.channel.awaitMessages(validationFilter, { max: 1, time: 1000 * 10, errors: ['wrong-answer'] })
                                        .then(validationResponse => {
                                            const response = validationResponse.first();
                                            if (response.content.toUpperCase() === 'Y') {
                                                connection.run().then(async() => {
                                                    addHomeworkToStudentDB({
                                                        _member: msg.author.id,
                                                        _homework: homework._id,
                                                        response: homework.type === 'text' ? msg.content : msg.attachments.first().attachment
                                                    })
                                                })
                                                response.reply('Envoyé.')
                                            } else if (response.content.toUpperCase() === 'N') response.reply('Le devoir n\'a pas été envoyé');
                                        })
                                        .catch(error => {
                                            m.channel.send('Vous avez commis une erreur lors de votre manipulation. Veuillez recommencer ultérieurement.')
                                        })
                                })
                        } else {
                            msg.reply('Vous n\'avez pas réalisé la manoeuvre correctement. Veuillez recommencer ultérieurement');
                            return;
                        }
                    }
                })
                .catch(error =>
                    user.send('L\'action a pris fin. Veuillez recommencer la manoeuvre.'))
        })

}