global.fetch = require('node-fetch');
const csvjson = require('csvjson');
const fs = require(`fs`);
const {mongo} = require("mongoose");

function getDateFromJSON(match) {
    const date = new Date(
        '20' + match[3],  // year
        match[2] - 1,  // monthIndex
        match[1],  // day
        match[4],  // hours
        match[5],  // minutes
        match[6]  //seconds
    );
    return date;
}

module.exports = (bot) => {
    bot.on('message', message => {

        const nomfichier = message.attachments.first().name;

        if (message.attachments.first()) {//checks if an attachment is sent
            const connection = require('../database/mongoose-connection')
            connection.run().then(async () => {

                console.log("Il y a un attachment")
                console.log("C'est : " + message.attachments.first().name)
                //get all the classes
                //
                const categoryChannels = message.guild.channels.cache.filter(channel => channel.type === "category");

                const isClass = nomfichier.substring(0, 6) === `Cours_`;
                const className = nomfichier.substring(6).split('.').slice(0, -1).join('.')
                const existingRole = categoryChannels.find(channel => channel.name === className);
                console.log(className);
                console.log(isClass);
                if (isClass && existingRole) {//Download only png (customize this)
                    download(message.attachments.first().url).then(lesCours => {
                        const db = require('../database/databaseFunction/dbFunctions')
                        lesCours.forEach(value =>{
                            const dateString1 = value.Date + ' ' + value['Heure Debut'];
                            const dateString2 = value.Date + ' ' + value['Heure Fin'];
                            const dateParser = /(\d{2})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
                            let match = dateString1.match(dateParser);
                            const dateDebut = getDateFromJSON(match);
                            match = dateString2.match(dateParser);
                            const dateFin = getDateFromJSON(match);
                            const name = value.Professeur.split(' ')
                            console.log(name);
                            //TODO check si un cours est déjà prevu à ces horaires si oui modifier le sujet et prof si !=
                            db.getMemberByName(name[0],name[1]).then(prof => {
                                const newClass = {
                                    subject:value.Matiere,
                                    prof:prof._id,
                                    dateDebut:dateDebut,
                                    dateFin:dateFin
                                }
                                db.addClass(newClass).then(c => {
                                    db.getRoleByName(className + ' élève').then(role => {
                                        role.calendar.push(c._id)
                                        role.save();
                                    })
                                });
                            })
                        })
                    })//Function I will show later
                }
            })
        }
    });

}

async function download(url) {
    return new Promise(resolve => {
        console.log("On passe dans download")
        fetch(url)
            .then(async res => {
                //ajoute un const pour le nom du fichier selon classe
                const dest = fs.createWriteStream('data/etudiants.csv');
                res.body.pipe(dest);
                await fs.readFile('data/etudiants.csv', 'utf8', function (err, data) {
                    const res = JSON.parse(CSVToJSON(data))
                    console.log(res);
                    resolve(res)
                });
            });
    })
}

function CSVToJSON(csvData) {
    var data = CSVToArray(csvData);
    var objData = [];
    for (var i = 1; i < data.length; i++) {
        objData[i - 1] = {};
        for (var k = 0; k < data[0].length && k < data[i].length; k++) {
            var key = data[0][k];
            objData[i - 1][key] = data[i][k]
        }
    }
    var jsonData = JSON.stringify(objData);
    jsonData = jsonData.replace(/},/g, "},\r\n");
    return jsonData;
}


function CSVToArray(csvData, delimiter) {
    delimiter = (delimiter || ";");
    var pattern = new RegExp((
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
    var data = [[]];
    var matches = null;
    while (matches = pattern.exec(csvData)) {
        var matchedDelimiter = matches[1];
        if (matchedDelimiter.length && (matchedDelimiter != delimiter)) {
            data.push([]);
        }
        if (matches[2]) {
            var matchedDelimiter = matches[2].replace(
                new RegExp("\"\"", "g"), "\"");
        } else {
            var matchedDelimiter = matches[3];
        }
        if (matchedDelimiter !== '') {
            data[data.length - 1].push(matchedDelimiter);
        }
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i].length === 0) {
            data.splice(i, 1);
            i--
        }
    }
    return (data);
}