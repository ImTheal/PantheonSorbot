module.exports = {
    commands: 'setdata',
    description: 'permet de changer les données de configuration',
    minArgs: 2,
    maxargs: 2,
    expectedArgs: "<data> <valeur>",
    requiredRoles: '',
    callback: (message, arguments) => {
        const json = require(`${racine}/config.json`);
        const fs = require(`fs`);
        let flag=false;
        for (let skrnn in json) {
            if(arguments[0]==skrnn){
                json[skrnn]=arguments[1]
                flag=true
                break;
            }
        }
        if (flag) {
            message.channel.send(`la valeur ${arguments[0]} vaut desormais ${arguments[1]}`)
        }else{
            message.channel.send(`la valeur ${arguments[0]} est inconnue`)
        }
        let dataStringified = JSON.stringify(json, null, 2);

        fs.writeFile(`${racine}/config.json`, dataStringified, (err) => {
            if (err) throw err;
            console.log('JSON écrit !');
        });

    },
  }