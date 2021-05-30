const connection = require('../../database/mongoose-connection');
const Discord = require('discord.js');
const { COMMON } = require('../../constants/common');
const { HOMEWORK } = require("../../constants/homework.js");
const { hasRightsOnHomeworkDB } = require("../../database/databaseFunction/homeworksFunctions");
const changeHomeworkName = require('./change-homework-name');
const deleteHomework = require('./delete-homework');
const sendHomeworkAnswers = require('./send-homework-answers')

module.exports = (author, channel, { _homework, name, _homeworkChannel }) => {

    connection.run().then(async() => {
        const message = new Discord.MessageEmbed()
            .setTitle(HOMEWORK['HOMEWORK_ADDED'] + ` (${name})`)
            .setDescription(`
                Vous pouvez effectuer des actions sur ce devoir à l\'aide des réactions sous ce message (si vous en êtes le propriétaire).\n
                Voici les fonctionnalités disponibles:\n
                • Modifier le nom du devoir '✏'\n
                • Supprimer un devoir '❌'\n
                • Voir les réponses du devoir '🔎'\n
                `)


        channel.send(message)
            .then(async(msg) => {

                const homeworkChannel = msg.guild.channels.cache.get(_homeworkChannel)

                //Ajout de la fonctionnalité 'modifier'
                createReaction({
                    _homework,
                    msg,
                    emoji: '✏',
                    confirmationLabel: HOMEWORK['UPDATE_NAME_CONFIRMATION'],
                    callback: () => {
                        changeHomeworkName({ _homework, author, homeworkChannel })
                    }
                })

                //Ajout de la fonctionnalité 'Supprimer'
                createReaction({
                    _homework,
                    msg,
                    emoji: '❌',
                    confirmationLabel: HOMEWORK['DELETE_HOMEWORK_CONFIRMATION'],
                    callback: () => {
                        deleteHomework({ _homework, homeworkChannel, author, msg })
                    }
                })

                //Ajout de la fonctionnalité 'Voir les réponses'
                createReaction({
                    _homework,
                    msg,
                    emoji: '🔎',
                    confirmationLabel: HOMEWORK['SEE_ANSWERS_CONFIRMATION'],
                    callback: () => {
                        sendHomeworkAnswers({
                            author,
                            _homework
                        })
                    }
                })
            })
    })
}

function createReaction({ _homework, msg, emoji, confirmationLabel, callback }) {
    msg.react(emoji);
    const filter = (reaction) => reaction.emoji.name === emoji && (reaction.count === 2);
    const collector = msg.createReactionCollector(filter);
    collector.on('collect', async(_, user) => {

        //Vérifier les droits de l'utilisateur
        hasRightsOnHomeworkDB(user.id, _homework)
            .then(async res => {
                if (!res) return;

                //Envoyer une confirmation
                await sendConfirmation(user, confirmationLabel)
                    .then(res => {
                        if (res) callback(); //Faire le traitement de la fonction passée en paramètre
                    })
            })

        //Supprimer les réactions
        removeReactions(msg, user);
    });
}

async function removeReactions(msg, user) {
    const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
    try {
        for (const reaction of userReactions.values()) {
            await reaction.users.remove(user.id);
        }
    } catch (error) {
        console.error('Failed to remove reactions.', error);
    }
}

async function sendConfirmation(user, label) {
    return await user.send(label)
        .then(msg => msg.channel.awaitMessages(_ => true, { max: 1, time: 1000 * 30 }) //Attente de la réponse sous 30 secondes
            .then(response => {
                const answer = response.first().content.toUpperCase();

                if (answer !== 'Y') {
                    msg.reply(COMMON['CANCELED_OPERATION']);
                    return false;
                }
                return true;
            })
            .catch(error => {
                return msg.reply(COMMON['TIME_ELAPSED'])
            })
        )
}