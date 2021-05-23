global.fetch = require('node-fetch');
const csvjson = require('csvjson');
const fs = require(`fs`);
module.exports = (bot) => {
    bot.on('message',async message => {

        function checkRoles(str){
            if(str.name=='admin'){
                return true
            }else{
                return false
            }
        }


        if (message.attachments.first()) {
        
            if (!message.member.roles.cache.some(checkRoles)) return
    

            const nomfichier = message.attachments.first().name
            console.log("Il y a un attachment")
            console.log("C'est : " + message.attachments.first().name)
            if (nomfichier.substring(nomfichier.length-4) === `.csv`) {

                const connection = require(global.racine+'/database/mongoose-connection')
                connection.run().then(async() => {
                    const db = require('../../database/databaseFunction/dbFunctions')
                    const gpName = nomfichier.split('.').slice(0, -1).join('.')
                    console.log(gpName);
                    const trtegfrt=await db.getGroupByName(gpName)
                    if(trtegfrt){
                        download(message.attachments.first().url,nomfichier).then((lesNoms)=>{
                            console.log(lesNoms);
                            lesNoms.forEach(async el => {
                                console.log(el)
                                const member = {
                                    idDiscord: null,
                                    firstname: el.prenom,
                                    lastname: el.nom,
                                    email: el.mail,
                                    checked: false
                                }
                                const mem = await db.checkMemberDB(member)
                                if (mem) {
                                    db.deleteGroupsOfMember(mem)
                                    db.addMemberInGroup(mem.nomdeclasse)
                                } else {
                                    db.createMemberAndAddInGroup(member, gpName)
                                }
                            });
                        })
                        message.react('✅')
                    }else{
                        message.reply("Le nom du fichier ne correspond à aucun groupe...")
                    }
                })
            }
        }
    });

}



async function download(url, fileName) {
    return new Promise(resolve => {
        fetch(url)
            .then(async res => {
                const dest = fs.createWriteStream(global.racine+'/data/members/' + fileName);
                res.body.pipe(dest);
                await fs.readFile(global.racine+'/data/members/' + fileName, 'utf8', function (err, data) {
                    const res = JSON.parse(CSVToJSON(data))
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