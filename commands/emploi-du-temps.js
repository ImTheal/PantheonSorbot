const mongoose = require("mongoose");


module.exports = {


    commands: 'edt',
    description: `avoir son emploi du temps en message privé`,
    minArgs: 0,
    callback: async (message, arguments, text) => {
        const db = require('../database/databaseFunction/dbFunctions');
        const libDb = require('../database/mongoose-connection');

        libDb.run().then(() => {
            const id = message.member.id;

            const now = new Date();


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

                var options = { month: 'long'};
                console.log(new Intl.DateTimeFormat('fr-FR', options).format(Xmas95));
                console.log(new Intl.DateTimeFormat('fr-FR', options).format(Xmas95));
                const messageAppel = new Discord.MessageEmbed()
                    .setColor('#5814783')
                    .setTitle(`Emploie du temps du ` + prevMonday.getDate() + ' ' + prevMonday.getMonth() + ' au ' + sunday.getDay()-1 + ' ' + sunday.getMonth())
                    .setAuthor(`Enseignant : ` + prof.firstname + ' ' + prof.lastname)
                    .setDescription('du ' + now.toLocaleString("fr-FR", {timeZone: "Europe/Paris"}))
                    .setTimestamp()
                    .setFooter(`Fin de l'appel`);
            })
        })
    },
}