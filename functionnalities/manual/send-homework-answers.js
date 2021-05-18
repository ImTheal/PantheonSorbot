const { getHomeworkInfosDB, getHomeworkResponsesDB } = require("../../database/databaseFunction/homeworksFunctions.js");
const connection = require('../../database/mongoose-connection');
const Discord = require('discord.js');

module.exports = (user, _homework) => {
    connection.run().then(async() => {

        const promises = [getHomeworkInfosDB(_homework), getHomeworkResponsesDB(_homework)]

        try {
            Promise.all(promises)
                .then(([infos, answers]) => {

                    const { name, renderingDate, type } = infos;
                    const now = new Date();

                    const message = new Discord.MessageEmbed()
                        .setTitle(`Réponses pour le devoir ${name}`);

                    if (!answers.length) {
                        message.setDescription(`Il n\'y a pas encore eu de réponses pour le devoir maison ${name}.`);
                        return user.send(message);
                    }

                    message.setDescription(`Voici les réponses receuillies pour le devoir maison ${name}.\nPour rappel, ` +
                        (now > renderingDate ?
                            `le devoir est à rendre pour le ${renderingDate.toLocaleDateString()}` :
                            `le devoir a atteint sa date limite le ${renderingDate.toLocaleDateString()}`));

                    message.addFields(answers.map(({ _member, response }) => {
                        return ({
                            name: _member,
                            value: response
                        })
                    }))

                    message.setFooter(`\nAu total, il y a eu ${answers.length} réponse${answers.length > 1 ? 's' : ''}`)
                        .setTimestamp();

                    user.send(message)
                })
        } catch (error) {
            user.send('Une erreur s\'est produite dans la récupération des réponses. Veuillez recommencer.');
        }

    })
}