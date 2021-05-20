const { addHomeworkDB, checkHomeworkNameDB } = require("../database/databaseFunction/homeworksFunctions.js");
const { getGroupIdByNameDB } = require("../database/databaseFunction/dbFunctions.js");
const { homeworkChannel } = require('../config.json');
const connection = require('../database/mongoose-connection');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const onSubmitHomework = require('../functionnalities/manual/on-submit-homework');
const { COMMON } = require("../constants/common.js");
const { HOMEWORK } = require("../constants/homework.js");

const getArguments = (args) => {
    let arguments = args.join(' ').split('] [').map(arg => {
        if (arg.includes('[')) return arg.substring(1);
        else if (arg.includes(']')) return arg.substring(0, arg.length - 1)

        return arg;
    });

    const name = arguments[0].split('-').join(' ').toLowerCase();
    const renderingDate = new Date(arguments[1]);
    const group = arguments[2].toUpperCase();
    const type = arguments[3];
    const description = arguments[4] || '';

    return { name, renderingDate, group, type, description }
}

const checkArguments = async({ name, renderingDate, group, type }, message) => {
    let errors = [];

    //Vérification du type
    if (!['pdf', 'text', 'txt', 'zip', 'java'].includes(type)) errors.push('INVALID_FORMAT');

    //Vérification de la date
    if (renderingDate <= new Date()) errors.push('INVALID_DATE');

    //Vérification du groupe
    if (!message.guild.channels.cache
        .filter(channel => channel.type === "category")
        .find(channel => channel.name === group)) errors.push('INVALID_GROUP')

    //Vérification du nom
    await checkHomeworkNameDB(name)
        .then(res => {
            if (res) errors.push('INVALID_NAME')
        })

    return errors.length ? errors : false;
}

const getHomeworkInstructions = ({ name, type, description, renderingDate, attachment, author }) => {
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

module.exports = {
    commands: 'new-homework',
    description: 'Create a new homework for students',
    expectedArgs: '<name> <date> <group> <type> <description>',
    permissionError: 'Tu as besoin des droits administrateurs pour executer cette commande',
    minArgs: 2,
    maxArgs: null,
    permissions: '',
    requiredRoles: [],
    callback: async(message, args) => {
        //Vérification du bon channel
        if (message.channel.id !== homeworkChannel) return;

        try {
            connection.run().then(async() => {

                const { guild, author } = message;

                //Rôle de tout le monde
                const everyoneRole = guild.roles.cache.find(role => role.name === '@everyone');

                //Récupération des arguments
                const { name, renderingDate, group, type, description } = getArguments(args);
                const attachment = message.attachments.first() ? new MessageAttachment(message.attachments.first().attachment) : null;

                //Vérification des erreurs
                const errors = await checkArguments({
                    name,
                    renderingDate,
                    group,
                    type,
                    description
                }, message);

                if (errors) return message.reply(errors.length > 1 ?
                    'Des erreurs ont été détectées : ' + errors.map(error => '\n' + HOMEWORK['ERRORS'][error]) :
                    'Une erreur a été détectée : ' + HOMEWORK['ERRORS'][errors[0]]);

                //Récupération de la catégorie
                const categoryId = message.guild.channels.cache
                    .filter(channel => channel.type === "category")
                    .find(channel => channel.name === group).id;

                //Création du channel
                await guild.channels.create('DM-' + name, {
                    parent: categoryId,
                    permissionOverwrites: [{
                        id: everyoneRole.id,
                        deny: ['SEND_MESSAGES']
                    }]
                }).then(async(channel) => {

                    let _homework;

                    //Ajout du devoir à la base de donnée
                    getGroupIdByNameDB(group)
                        .then(_group => {
                            addHomeworkDB({
                                    name,
                                    _channel: channel.id,
                                    _guild: guild.id,
                                    _group,
                                    _teacher: author.id,
                                    renderingDate,
                                    type,
                                    description
                                })
                                .then(homework => _homework = homework._id)
                        })

                    message.reply(HOMEWORK['HOMEWORK_ADDED']);

                    const homeworkInstructions = getHomeworkInstructions({ name, type, description, renderingDate, attachment, author })

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
            return message.reply(COMMON['EXPECTED_FORM'] + ' : ' + '=new-homework [name] [date] [group] [type] [descrition]');
        }
    }
}