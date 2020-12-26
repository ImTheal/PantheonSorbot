const { prefix } = require('../config.json')

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`La permission suivante n'existe pas : "${permission}"`)
    }
  }
}

module.exports = (bot, commandOptions) => {
  let {
    commands,
    expectedArgs = '',
    permissionError = 'Tu n\'as pas la permission nécessaire pour lancer cette commande.',
    minArgs = 0, 
    maxArgs = null,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions

  // S'assurer que la commande sont bien stockees dans un tableau
  if (typeof commands === 'string') {
    commands = [commands]
  }

  console.log(`Enregitrement de la commande "${commands[0]}"`)

  // S'assurer que les permissions sont bien stockees dans un tableau et sont valides
  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  // Attendre un message
  bot.on('message', (message) => {
    const { member, content, guild } = message

    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`

      if (
        content.toLowerCase().startsWith(`${command} `) ||
        content.toLowerCase() === command
      ) {
        //Lancement de la commande

        // S'assurer que l'utilisateur a la permission
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(permissionError)
            return
          }
        }

        // S'assurer que l'utilisateur a le bon role

        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          )

          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `Tu dois avoir le rôle "${requiredRole}" pour exécuter cette commande.`
            )
            return
          }
        }

        // séparer à chaque espace vide
        const arguments = content.split(/[ ]+/)

        // Retirer le nom de la commande pour isoler les arguments
        arguments.shift()

        // S'assurer du bon nombre d'arguments
        if (
          arguments.length < minArgs ||
          (maxArgs !== null && arguments.length > maxArgs)
        ) {
          message.reply(
            `Syntaxe incorrecte. Utiliser ${prefix}${alias} ${expectedArgs}`
          )
          return
        }

        // Lancer le code de la commande
        callback(message, arguments, arguments.join(' '), bot)

        return
      }
    }
  })
}