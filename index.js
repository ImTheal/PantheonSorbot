const Discord = require('discord.js');
const path = require('path')
const fs = require('fs');
const { prefix, token } = require('./config.json');
const fetch = require('node-fetch');
const { report } = require('process');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

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

bot.login(process.env.TOKENSOR)