global.fetch = require('node-fetch');
const csvjson = require('csvjson');
const fs = require(`fs`);
const { syncBuiltinESMExports } = require('node:module');
module.exports= (bot) =>{
    bot.on('message',message =>{

        const nomfichier=message.attachments.first().name

        if(message.attachments.first()){//checks if an attachment is sent
            console.log("Il y a un attachment")
            console.log("C'est : "+message.attachments.first().name)
            if(message.attachments.first().name === `test.csv`){//Download only png (customize this)
                const lesNoms=download(message.attachments.first().url);//Function I will show later
            }
        }

        const connection = require('../database/mongoose-connection')
        connection.run().then(()=>{
            const db=require('../database/databaseFunction/dbFunctions')
            const className=nomfichier.split('.').slice(0, -1).join('.')
            console.log(className);

            lesNoms.forEach(el => {

                const member={
                    idDiscord:null,
                    firstname:el.prenom,
                    lastname:el.nom,
                    email:el.mail,
                    checked:false                    
                }
                const mem=db.checkMemberDB(member)
                if(mem){
                    db.deleteGroupsOfMember(mem)
                    db.addMemberInGroup(mem.nomdeclasse)
                }else{
                    db.createMemberAndAddInGroup(member, className)
                }
            });
        })


    });
    
}

        async function download(url){
            console.log("On passe dans download")
            fetch(url)
                .then(res => {
                    const dest = fs.createWriteStream('data/etudiants.csv');
                    res.body.pipe(dest);
                    fs.readFile('data/etudiants.csv', 'utf8', function(err, data){
                        const trtr=JSON.parse(CSVToJSON(data))
                        console.log(trtr);
                        return trtr
                    });
                });
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
                if(matchedDelimiter!==''){
                    data[data.length - 1].push(matchedDelimiter);
                } 
            }
            for (let i = 0; i < data.length; i++) {
                if(data[i].length===0){
                    data.splice(i, 1);
                    i--
                }
            }
            return (data);
        }