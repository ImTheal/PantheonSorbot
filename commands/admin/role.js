module.exports = {
    commands: 'role',
    description: 'Réalise des opérations sur les roles',
    minArgs: 2,
    maxargs: 3,
    expectedArgs: "<create|give|remove|delete> <nom du role> [personne]",
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments) => {

      const { guild } = message
      if(arguments[0]=='create'||arguments[0]=='delete'){

        if(arguments[0]=='create'){
          guild.roles.create({
            data: {
              name: arguments[1],
            }
          })
            .then(console.log)
            .catch(console.error);

          message.channel.send(`Le rôle ${arguments[1]} a été créé !`)
          return

        }else{ // si c'est delete

          const role = guild.roles.cache.find((role) => {
            return role.name === arguments[1]
          })

          if (!role) {
            message.reply(`le role "${arguments[1]}" n'existe pas !`)
            return
          }

          role.delete(role.name)
          .then(deleted => message.channel.send(`Le role "${deleted.name}" a été supprimé`))
          .catch(console.error);
          return

        }

      }else if(arguments[0]=='give'||arguments[0]=='remove'){
        const targetUser = message.mentions.users.first()
        if (!targetUser) {
          message.reply(`Mentionnez l'utilisateur a qui assigner un role.`)
          return
        }
        
        const role = guild.roles.cache.find((role) => {
          return role.name === arguments[1]
        })
        if (!role) {
          message.reply(`le role "${arguments[1]}" n'existe pas !`)
          return
        }
    
        const member = guild.members.cache.get(targetUser.id)

        if(arguments[0]=='give'){
          
          member.roles.add(role)
          message.reply(`Cet utilisateur a désormais le rôle "${role.name}"`)
          return

        }else{  // si c'est remove
          member.roles.remove(role)
          message.reply(`Cet utilisateur n'a désormais plus le rôle "${role.name}"`)
          return

        }



      }else{
        message.reply(`${arguments[1]} n'est pas valable`)
        return
      }

    },
  }