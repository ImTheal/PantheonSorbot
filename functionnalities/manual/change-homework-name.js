const connection = require('../../database/mongoose-connection');
const { COMMON } = require('../../constants/common');
const { HOMEWORK } = require("../../constants/homework.js");
const { checkHomeworkNameDB, changeHomeworkNameDB } = require('../../database/databaseFunction/homeworksFunctions');

module.exports = ({ _homework, author, homeworkChannel }) => {

    connection.run().then(async() => {

        author.send('Quel est le nouveau nom que vous souhaitez donner à votre devoir ?')
            .then(msg => {
                msg.channel.awaitMessages(_ => true, { max: 1, time: 1000 * 60 * 5 }) //Attente de la réponse sous 5 minutes
                    .then(async res => {

                        const response = res.first();

                        const name = response.content.toLowerCase().split('-').join(' ');

                        //Si le nom existe déjà, on ne peut pas le remplacer
                        await checkHomeworkNameDB(name)
                            .then(res => {
                                if (res) return response.reply(HOMEWORK['EXISTING_NAME'])

                                homeworkChannel.setName('DM-' + name);

                                changeHomeworkNameDB(_homework, name)
                                    .then(res => response.reply(res ? COMMON['SUCCESSFUL_OPERATION'] : COMMON['FAILED_OPERATION']))
                            })
                    })
                    .catch(error => {
                        return msg.reply(COMMON['TIME_ELAPSED'])
                    })
            })
    })
}