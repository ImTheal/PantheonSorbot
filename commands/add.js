module.exports = {
    commands: ['add', 'addition'],
    description: `Réalise l'addition de deux nombres`,
    expectedArgs: '<num1> <num2>',
    permissionError: 'Tu as besoin des droits administrateurs pour executer cette commande',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
      const num1 = +arguments[0]
      const num2 = +arguments[1]
  
      message.reply(`La somme vaut ${num1 + num2}`)
    },
    permissions: '',
    requiredRoles: [],
  }