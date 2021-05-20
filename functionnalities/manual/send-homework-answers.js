const { getHomeworkInfosDB, getHomeworkResponsesDB } = require("../../database/databaseFunction/homeworksFunctions.js");
const connection = require('../../database/mongoose-connection');
const Discord = require('discord.js');
const { getMemberByDiscordIdDB } = require("../../database/databaseFunction/dbFunctions.js");
const { COMMON } = require('../../constants/common');

module.exports = ({ author, _homework }) => {
    connection.run().then(async() => {

        const promises = [getHomeworkInfosDB(_homework), getHomeworkResponsesDB(_homework)]

        try {
            //On récupère les infos du devoir et les réponses
            Promise.all(promises)
                .then(async([infos, answers]) => {

                    const { name, renderingDate } = infos;

                    const now = new Date();

                    //On formate le message
                    const message = new Discord.MessageEmbed()
                        .setTitle(`Réponses pour le devoir ${name}`);

                    //Si il n'y a pas de réponse
                    if (!answers.length) {
                        message.setDescription(`Il n\'y a pas encore eu de réponses pour le devoir maison ${name}.`);
                        return author.send(message);
                    }

                    message.setDescription(`Voici les réponses receuillies pour le devoir maison ${name}.\nPour rappel, ` +
                        (now < renderingDate ?
                            `le devoir est à rendre pour le ${renderingDate.toLocaleDateString()}` :
                            `le devoir a atteint sa date limite le ${renderingDate.toLocaleDateString()}`));

                    message.addFields(await formattedAnswers(answers))

                    message.setFooter(`\nAu total, il y a eu ${answers.length} réponse${answers.length > 1 ? 's' : ''}`)
                        .setTimestamp();

                    author.send(message);

                }).catch(error => author.send(COMMON['FAILED_OPERATION']))
        } catch (error) {
            author.send(COMMON['FAILED_OPERATION']);
        }

    })
}

async function formattedAnswers(answers) {
    return await Promise.all(answers.map(({ _member, response }) => {
        return getMemberByDiscordIdDB(_member)
            .then(member => member ? member.firstname + ' ' + member.lastname : _member)
            .then(name => ({
                name,
                value: response
            }))
    }))
}