const { getExpiredHomeworksDB, updateHomeworkChannelsDB } = require("../../database/databaseFunction/homeworksFunctions.js");
const connection = require('../../database/mongoose-connection');
const sendHomeworkAnswers = require("../manual/send-homework-answers.js");

const TIMEOUT_DURATION = 60 * 1000; //1 minute - la fonction recommence toutes les minutes

module.exports = client => {
    connection.run().then(async() => {

        const checkForExpired = async() => {
            getExpiredHomeworksDB()
                .then(results => {
                    if (!results) return;

                    results.forEach(homework => {
                        const { _channel, _teacher, _guild, _id } = homework;

                        const guild = client.guilds.cache.get(_guild);
                        const channel = guild.channels.cache.get(_channel);

                        if (channel) {
                            //Suppression des channels
                            channel.delete();

                            //Envoie un message au prof, avec toutes les réponses
                            client.users.fetch(_teacher).then((user) => {
                                sendHomeworkAnswers(user, _id);
                            });
                        }
                    });

                    //Mettre l'attribut channelDeleted à true
                    updateHomeworkChannelsDB(results.map(result => result._id));

                });

            setTimeout(checkForExpired, TIMEOUT_DURATION);
        }

        checkForExpired();
    })
}