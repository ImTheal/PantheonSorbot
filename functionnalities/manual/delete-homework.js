const connection = require('../../database/mongoose-connection');
const { COMMON } = require('../../constants/common');
const { deleteHomeworkDB } = require("../../database/databaseFunction/homeworksFunctions");

module.exports = ({ _homework, homeworkChannel, author, msg }) => {

    connection.run().then(async() => {

        //Suppression du channel
        homeworkChannel.delete();

        //Suppression du message dans le channel de devoir
        msg.delete();

        //Suppression du devoir dans la base de données
        deleteHomeworkDB(_homework)
            .then(res => author.send(res ? COMMON['SUCCESSFUL_OPERATION'] : COMMON['FAILED_OPERATION.']))
    })
}