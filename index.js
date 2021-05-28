const Discord = require('discord.js');
const path = require('path')
const fs = require('fs');
const { prefix, token } = require('./config.json');
const fetch = require('node-fetch');
const { report } = require('process');
const bot = new Discord.Client();
const nodemailer = require('nodemailer');
const libConnection = require('./database/mongoose-connection');
bot.commands = new Discord.Collection();
global.racine = path.resolve(__dirname); //racine est accessible partout et correspond a la racine du projet

require('dotenv').config({ path: __dirname + '/.env' })

bot.on('ready', async() => {
    console.log('Le bot est en ligne !')

    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                bot.commands.set(file, option);

                commandBase(bot, option)
            }
        }
    }

    const readFunc = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readFunc(path.join(dir, file))
            } else {
                const option = require(path.join(__dirname, dir, file))
                let Func = require(`./functionnalities/auto/${file}`)
                Func(bot)
                console.log(`Fonctionnalité chargée : ${file}`)
            }
        }
    }

    readCommands('commands')
    readFunc('functionnalities/auto')
})

// lors de l'arrivée d'un membre sur le discord
bot.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.get('835484727040540672');
      channel.send('**[+]** <@!' + member + '>');
  
      // Demande de l'adresse mail en privé
      const requestEmailAddress = async function()
      {
          const msg = await member.send('Bonjour <@!' + member + '>, afin de vérifier ton identité, nous allons t\'envoyer un code de' +
          ' vérifiation sur ton adresse mail universitaire.\nSaisie ton adresse mail ci-dessous (60s) :');
          const filter = collected => collected.author.id === member.id;
          const collected = await msg.channel.awaitMessages(filter, {
              max: 1,
              time: 60000,
          }).catch(() =>
          {
              member.send('Timeout.');
          });
      
          try 
          {
              // s'il s'agit bien d'une adresse mail
              if(collected.first().content.indexOf('@') > -1)
              {
                console.log(nodemailer);
                  const transporter = nodemailer.createTransport(
                      {
                          service: 'gmail',
                          auth: {
                              user: 'pantheonsorbot@gmail.com',
                              pass: 'Sorbot2021!',
                          },
                      });
                      
                  const code = getRandomArbitrary(1000, 10000);
                  const mailOptions =
                  {
                      from: 'pantheonsorbot@gmail.com',
                      to: collected.first().content.toLowerCase(),
                      subject: 'Code de vérification',
                      text: 'Code à envoyer au bot : ' + code,
                  };
                  // alors envoie du code avec stockage en BD.
                  transporter.sendMail(mailOptions, function(error, info)
                  {
                      if (error)
                      {
                          console.log(error);
                      }
                      else
                      {
                          console.log('Email sent : ' + info.response);
                          console.log('Sent to : ' + collected.first().content.toLowerCase() + ' | code = ' + code);
                          libConnection.run().then(() =>
                          {
                              const lib = require('./database/databaseFunction/dbFunctions');
                              lib.setCodeDB(code, collected.first().content.toLowerCase()).then((boolean) =>
                              {
                                  console.log('code into DB' + boolean);
                              });
                          });
                          // on attends ensuite la réponse.
                          requestCode(code, collected.first().content.toLowerCase());
                      }
                  });
              }
              else
              {
                   // member.send('Adresse email incorrecte');
                  member.kick();
                  channel.send('<@!' + member + '> was kicked. (code check)');
                  return console.log('La réponse envoyé n\'était pas une adresse mail.');
              }
          }
          catch (error)
          {
               // member.send('Aucune réponse');
              member.kick();
              channel.send('<@!' + member + '> was kicked. (code check)');
              return console.log('Aucune réponse');   
          }
      };
  
      // On renvoie un nombre aléatoire entre une valeur min (incluse)
      // et une valeur max (exclue)
      const getRandomArbitrary = function getRandomArbitrary(min, max)
      {
          return Math.round(Math.random() * (max - min) + min);
      };
      // Call start
      requestEmailAddress();
  
      const requestCode = async function(code, emailMember)
      {
          const msg = await member.send('Code envoyé. Veuillez le saisir : (5 min)');
          const filter = collected => collected.author.id === member.id;
          const collected = await msg.channel.awaitMessages(filter, {
              max: 1,
              time: 300000,
          }).catch(() =>
          {
              member.send('Timeout.');
          });
  
          try 
          {
              if(collected.first().content == code)
              {
                  console.log('code ok');
                  libConnection.run().then(() =>
                  {
                      const lib = require('./database/databaseFunction/dbFunctions');
                      lib.setMemberChecked(emailMember).then((boolean) =>
                      {
                          console.log('MEMBER CHECKED TRUE ? = ' + boolean);
                      });
                  });
              }
              else
              {
                  // member.send('Mauvais code');
                  member.kick();
                  channel.send('<@!' + member + '> was kicked. (code check)');
                  console.log('code nOk');
              }
          }
          catch (error)
          {
              return console.log('Aucune réponse');   
          }
      };
  });
  
  bot.on("guildMemberRemove", member => {
      const channel = member.guild.channels.cache.get('835484727040540672');
      channel.send('**[-]** <@!' + member + '>');
  });


bot.login("Nzc5MDkzNjA4NzcwNTY4MjIy.X7bhdw.J0DkI0rIc1EsSf7NkkbDthDau_8")