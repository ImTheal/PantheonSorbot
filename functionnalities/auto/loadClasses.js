global.fetch = require('node-fetch');
const csvjson = require('csvjson');
const fs = require(`fs`);
const mongoose = require("mongoose");
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

        function checkRoles(str){
            if(str.name=='admin'){
                return true
            }else{
                return false
            }
        }

        if (message.attachments.first()) {//checks if an attachment is sent

            if (!message.member.roles.cache.some(checkRoles)) return

            const nomfichier = message.attachments.first().name;
            const connection = require(global.racine+'/database/mongoose-connection')
            connection.run().then(async () => {

                console.log("Il y a un attachment")
                console.log("C'est : " + message.attachments.first().name)
                //get all the classes
                //
                const categoryChannels = message.guild.channels.cache.filter(channel => channel.type === "category");

                const isClass = nomfichier.substring(0, 6) === `Cours_`;
                const className = nomfichier.substring(6).split('.').slice(0, -1).join('.')
                const existingRole = categoryChannels.find(channel => channel.name === className);
                if (isClass && existingRole) {//Download only png (customize this)
                    download(message.attachments.first().url, nomfichier).then(lesCours => {
                        const db = require('../database/databaseFunction/dbFunctions')
                        lesCours.forEach(value => {
                            const dateString1 = value.Date + ' ' + value['Heure Debut'];
                            const dateString2 = value.Date + ' ' + value['Heure Fin'];
                            const dateParser = /(\d{2})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
                            let match = dateString1.match(dateParser);
                            const dateDebut = getDateFromJSON(match);
                            match = dateString2.match(dateParser);
                            const dateFin = getDateFromJSON(match);
                            const name = value.Professeur.split(' ')
                            db.getRoleByName(className + ' élève').then(role => {
                                //get all classes
                                db.getAllClasses().then(classes =>{
                                    const classAtSameHour = classes.find(c =>{
                                        if (c.dateDebut.getTime() === dateDebut.getTime() &&
                                            c.dateFin.getTime() === dateFin.getTime()) return true;
                                    });
                                    db.getMemberByName(name[0], name[1]).then(prof => {
                                        //TODO si prof n'existe pas ?? crash /!\
                                        if (classAtSameHour){
                                               const query = {_id:classAtSameHour._id};
                                               const update = {
                                                   subject: value.Matiere,
                                                   prof:prof._id
                                               }
                                               mongoose.set('useFindAndModify', false);
                                               db.findAndUpadateClass(query,update);
                                        } else {
                                            const newClass = {
                                                subject: value.Matiere,
                                                prof: prof._id,
                                                dateDebut: dateDebut,
                                                dateFin: dateFin
                                            }
                                            db.addClass(newClass).then(c => {
                                                role.calendar.push(c._id)
                                                role.save();
                                            });
                                        }
                                    })

                                })

                            })

                        })
                    })//Function I will show later
                }
            })
        }
    });

}

async function download(url, fileName) {
    return new Promise(resolve => {
        fetch(url)
            .then(async res => {
                const dest = fs.createWriteStream(global.racine+'data/calendar/' + fileName);
                res.body.pipe(dest);
                await fs.readFile(global.racine+'data/calendar/' + fileName, 'utf8', function (err, data) {
                    const res = JSON.parse(CSVToJSON(data))
                    resolve(res)
                });
            });
    })
}

function CSVToJSON(csvData) {
    const data = CSVToArray(csvData);
    let objData = [];
    for (let i = 1; i < data.length; i++) {
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
    const pattern = new RegExp((
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
    let data = [[]];
    let matches = null;
    while (matches = pattern.exec(csvData)) {
        let matchedDelimiter = matches[1];
        if (matchedDelimiter.length && (matchedDelimiter !== delimiter)) {
            data.push([]);
        }
        if (matches[2]) {
            matchedDelimiter = matches[2].replace(
                new RegExp("\"\"", "g"), "\"");
        } else {
            matchedDelimiter = matches[3];
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