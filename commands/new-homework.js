const { addHomeworkDB, checkHomeworkNameDB } = require("../database/databaseFunction/homeworksFunctions.js");
const { getGroupIdByNameDB } = require("../database/databaseFunction/dbFunctions.js");
const { homeworkChannel } = require('../config.json');
const connection = require('../database/mongoose-connection');
const { MessageAttachment } = require('discord.js');
const { COMMON } = require("../constants/common.js");
const { HOMEWORK } = require("../constants/homework.js");
const sendHomeworkValidation = require("../functionnalities/manual/send-homework-validation.js");
const sendHomeworkInstructions = require("../functionnalities/manual/send-homework-instructions.js");

module.exports = {
    commands: 'new-homework',
    description: 'Create a new homework for students',
    expectedArgs: '<name> <date> <group> <type> <description>',
    permissionError: 'Tu as besoin des droits administrateurs pour executer cette commande',
    minArgs: 5,
    maxArgs: null,
    permissions: '',
    requiredRoles: [],
    callback: async(message, args) => {
        //Vérification du bon channel
        if (message.channel.id !== homeworkChannel) return;

        try {
            connection.run().then(async() => {

                const { guild, author } = message;

                const _teacher = author.id;

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

                    //On récupère le groupe avec le bon nom
                    await getGroupIdByNameDB(group)
                        .then(_group => {
                            //Ajout du devoir à la base de donnée
                            addHomeworkDB({
                                    name,
                                    _channel: channel.id,
                                    _guild: guild.id,
                                    _group,
                                    _teacher,
                                    renderingDate,
                                    type,
                                    description
                                })
                                .then(homework => _homework = homework._id)
                                .then(() => {
                                    //Envoi d'un message de confirmation dans le channel des devoirs
                                    sendHomeworkValidation(author, message.channel, { _homework, name, _homeworkChannel: channel.id });

                                    //Envoi des intructions du devoir
                                    sendHomeworkInstructions({
                                        channel,
                                        homework: {
                                            name,
                                            type,
                                            description,
                                            renderingDate,
                                            attachment,
                                            author,
                                            _id: _homework
                                        }
                                    })
                                })
                        })
                })
            })
        } catch (error) {
            return message.reply(COMMON['EXPECTED_FORM'] + ' : ' + '=new-homework [name] [date] [group] [type] [description]');
        }
    }
}

function getArguments(args) {
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

async function checkArguments({ name, renderingDate, group, type }, message) {
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