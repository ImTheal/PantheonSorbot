const mongoose = require("mongoose");
const Discord = require("discord.js");


module.exports = {


    commands: 'edt',
    description: `avoir son emploi du temps en message privé`,
    minArgs: 0,
    callback: async (message, arguments, text) => {
        const db = require('../database/databaseFunction/dbFunctions');
        const libDb = require('../database/mongoose-connection');

        libDb.run().then(() => {
            const id = message.member.id;

            db.getAllClassesFromMember(id).then(classes =>{
                let prevMonday = new Date();
                prevMonday.setHours(0,0,0,0);
                prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
                console.log(prevMonday);
                let sunday = new Date(prevMonday)
                sunday = new Date(sunday.setDate(sunday.getDate()+5));
                console.log(sunday)
                const classesOfTheWeek = classes.filter(cla => {

                    const afterMonday = cla.dateD.getTime() > prevMonday.getTime();
                    const beforeSunday = cla.dateF.getTime() < sunday.getTime();
                    console.log(afterMonday)
                    console.log(beforeSunday)

                    if (afterMonday &&
                        beforeSunday) return true;
                });
                console.log(classesOfTheWeek)
                let fields = [];
                let dateTmp = new Date(prevMonday);
                for (let i = prevMonday.getDate(); i < sunday.getDate(); i++) {
                    const classesOfTheDay = classesOfTheWeek.filter(cl => cl.dateD.getDate() === i);
                    let fieldValue = "";
                    const locales = "fr-FR";
                    if (classesOfTheDay !== []){
                        classesOfTheDay.forEach(cl =>{
                            fieldValue = fieldValue.concat(
                                cl.dateD.toLocaleTimeString(locales) +
                                '-' +
                                cl.dateF.toLocaleTimeString(locales) +
                                ' | ' +
                                cl.subject +
                                ' | ' +
                                cl.name +
                                '\n'
                            )
                        })
                    }
                    if (fieldValue === ""){
                        fieldValue = "Aucun"
                    }
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    fields.push({
                        name:dateTmp.toLocaleDateString(locales, options),
                        value:fieldValue
                    })
                    dateTmp.setDate(dateTmp.getDate()+1);
                }
                var options = { month: 'long'};
                const monMounth = new Intl.DateTimeFormat('fr-FR', options).format(prevMonday)
                const sunMounth = new Intl.DateTimeFormat('fr-FR', options).format(sunday)
                const messageAppel = new Discord.MessageEmbed()
                    .setColor('#9C0412')
                    .setTitle(`Emploi du temps du ` + prevMonday.getDate() + ' ' + monMounth + ' au ' + sunday.getDay() + ' ' + sunMounth)
                    .setAuthor(`Sorbot`)
                    .addFields(fields)
                    .setTimestamp()
                    .setFooter(`EDT by Sorbot`);

                message.author.send(messageAppel);
            })
        })
    },
}