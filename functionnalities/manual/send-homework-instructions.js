const { MessageEmbed } = require('discord.js');
const connection = require('../../database/mongoose-connection');
const onSubmitHomework = require('./on-submit-homework');

module.exports = ({ channel, homework }) => {

    connection.run().then(async() => {

        const { name, type, description, renderingDate, attachment, author, _id } = homework;

        //Construction du message
        const homeworkInstructions = getHomeworkInstructions({
            name,
            type,
            description,
            renderingDate,
            attachment,
            author
        })

        channel.send(homeworkInstructions)
            .then(async(msg) => {
                msg.react('✅');
                const filter = (reaction) => reaction.emoji.name === '✅' && (reaction.count === 2);
                const collector = msg.createReactionCollector(filter);
                collector.on('collect', async(_, user) => {

                    onSubmitHomework(user, {
                        name,
                        renderingDate,
                        type,
                        _id
                    });

                    //on retire la réaction
                    removeReactions({ msg, user });

                });
            })
    })
}

function getHomeworkInstructions({ name, type, description, renderingDate, attachment, author }) {
    const message = new MessageEmbed()
        .setTitle(`Nouveau devoir maison ${name}`)
        .setDescription((description.length && (description + '\n\n')) + 'Veuillez cliquer sur le bouton "✅" afin de soumettre le travail.')
        .addFields({
            name: 'Date de rendu',
            value: renderingDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }, {
            name: 'Type de rendu',
            value: type
        })
        .setFooter(`Pour plus d'informations, l'enseignant ${author.username} est à votre disposition.`);

    if (attachment) message.attachFiles(attachment);

    return message;
}

async function removeReactions({ msg, user }) {
    const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

    try {
        for (const reaction of userReactions.values()) {
            await reaction.users.remove(user.id);
        }
    } catch (error) {
        console.error('Failed to remove reactions.');
    }
}