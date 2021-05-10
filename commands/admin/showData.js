module.exports = {
    commands: 'showdata',
    description: 'permet de voir les données de configuration',
    minArgs: 0,
    maxargs: 0,
    expectedArgs: "",
    requiredRoles: '',
    callback: (message, arguments) => {
        const data = require(`${racine}/config.json`);
        message.channel.send(encoder(JSON.stringify(data,null, 4)))
    },




}

function encoder(str){
    return '```json\n'+str+'```'
}