const { addHomeworkDB, checkHomeworkNameDB } = require("../database/databaseFunction/homeworksFunctions.js");
const { homeworkChannel } = require('../config.json');
const connection = require('../database/mongoose-connection');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const onSubmitHomework = require('../functionnalities/manual/on-submit-homework');


const ERROR_MESSAGE = {
    'INVALID_DATE': 'date invalide (veuillez essayer avec une date supérieure à maintenant)',
    'INVALID_FORMAT': 'mauvais format (veuillez choisir entre ceux existants)',
    'INVALID_NAME': 'nom incorrect (veuillez choisir un nom qui n\'existe pas déjà)',
}

const getArguments = (args) => {
    let arguments = args.join(' ').split('] [').map(arg => {
        if (arg.includes('[')) return arg.substring(1);
        else if (arg.includes(']')) return arg.substring(0, arg.length - 1)

        return arg;
    });

    const name = arguments[0].split('-').join(' ').toLowerCase();
    const renderingDate = arguments[1];
    const type = arguments[2];
    const description = arguments[3] || '';

    return { name, renderingDate, type, description }
}

const checkArguments = async(arguments) => {
    let errors = [];
    const { name, renderingDate, type } = arguments;

    //Vérification du type
    if (!['pdf', 'text', 'txt'].includes(type)) errors.push('INVALID_FORMAT');

    //Vérification de la date
    if (new Date(renderingDate) <= new Date()) errors.push('INVALID_DATE');

    //Vérification du nom
    await checkHomeworkNameDB(name)
        .then(res => {
            if (res) errors.push('INVALID_NAME')
        })

    return errors.length ? errors : false;
}

module.exports = {
    commands: 'new-homework',
    description: 'Create a new homework for students',
    expectedArgs: '<name> <date> <type> <description>',
    permissionError: 'Tu as besoin des droits administrateurs pour executer cette commande',
    minArgs: 2,
    maxArgs: null,
    permissions: '',
    requiredRoles: [],
    callback: async(message, args) => {
        if (message.channel.id !== homeworkChannel) return;

        try {
            connection.run().then(async() => {

                const { guild, author } = message;

                //Rôle de tout le monde
                const everyoneRole = guild.roles.cache.find(role => role.name === '@everyone');

                const arguments = getArguments(args);
                const attachment = message.attachments.first() ? new MessageAttachment(message.attachments.first().attachment) : null;
                let errors;
                await checkArguments(arguments).then(res => errors = res);

                if (errors) return message.reply(errors.length > 1 ?
                    'Des erreurs ont été détectées : ' + errors.map(error => '\n' + ERROR_MESSAGE[error]) :
                    'Une erreur a été détectée : ' + ERROR_MESSAGE[errors[0]]);

                //Création du channel
                await guild.channels.create('DM-' + arguments.name, {
                    parent: '841391526189596672', //homeworks category
                    permissionOverwrites: [{
                        id: everyoneRole.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }, {
                        id: everyoneRole.id, //Temporary, should only be targeted students
                        allow: ['VIEW_CHANNEL']
                    }]
                }).then(async(channel) => {

                    let _homework;

                    //Ajout du devoir à la base de donnée
                    addHomeworkDB({
                        name: arguments.name,
                        _channel: channel.id,
                        _guild: guild.id,
                        _teacher: author.id,
                        renderingDate: new Date(arguments.renderingDate),
                        type: arguments.type,
                        description: arguments.description
                    }).then(res => {
                        _homework = res._id;
                    })

                    message.reply('Nouveau devoir ajouté');

                    const homeworkInstructions = new MessageEmbed()
                        .setTitle(`Nouveau devoir maison ${arguments.name}`)
                        .setDescription((arguments.description.length && (arguments.description + '\n\n')) + 'Veuillez cliquer sur le bouton "✅" afin de soumettre le travail.')
                        .addFields({
                            name: 'Date de rendu',
                            value: new Date(arguments.renderingDate).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })
                        }, {
                            name: 'Type de rendu',
                            value: arguments.type
                        })
                        .setFooter(`Pour plus d'informations, l'enseignant ${author.username} est à votre disposition.`, author.displayAvatarURL);

                    if (attachment) homeworkInstructions.attachFiles(attachment);

                    channel.send(homeworkInstructions)
                        .then(async(msg) => {
                            msg.react('✅');
                            const filter = (reaction) => reaction.emoji.name === '✅' && (reaction.count === 2);
                            const collector = msg.createReactionCollector(filter);
                            collector.on('collect', async(_, user) => {

                                onSubmitHomework(user, {
                                    name: arguments.name,
                                    renderingDate: arguments.renderingDate,
                                    type: arguments.type,
                                    _id: _homework
                                });

                                const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
                                try {
                                    for (const reaction of userReactions.values()) {
                                        await reaction.users.remove(user.id);
                                    }
                                } catch (error) {
                                    console.error('Failed to remove reactions.');
                                }
                            });
                        })
                })

            })

        } catch (error) {
            return message.reply('Pour créer un nouveau devoir, veuillez utiliser la forme suivante  : \n =new-homework [name] [date] [type] [descrition]');
        }
    }
}