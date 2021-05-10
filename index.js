const Discord = require('discord.js');
const path = require('path')
const fs =require('fs');
const { prefix, token } = require('./config.json');
const fetch = require('node-fetch');
const { report } = require('process');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

bot.on('ready', async () => {
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

  readCommands('commands')
})


bot.login(process.env.TOKENTEST)

// let spreadsheetID = '18lwKPEUaRRsMT-4ajR4Y32SZOjg1UT_A4vffSA4B8es'
// var url = `https://spreadsheets.google.com/feeds/list/${spreadsheetID}/od6/public/values?alt=json`;

// function create(url){
//     let str=''
//     let fc=[]
//     fetch(url,{method: 'GET'})
//       .then(response => response.json())
//       .then(json => json.feed.entry)
//       .then(entry => {
//           for (const iterator of entry) {
//               let nom=iterator.gsx$date.$t.split('/')
//               let date=new Date(20+nom[2],nom[1],nom[0]).getTime()
//               let ligne=`{"date":${date},"cours":"${iterator.gsx$cours.$t}","prof":"${iterator.gsx$prof.$t}"}`
//               let obj=JSON.parse(ligne)
              
//               if(fc.length==0){
//                 fc.push(obj) 
//               }else{
//                 for (const it of fc) {
//                   if(obj.date === it.date){
//                     fc.splice(fc.indexOf(it), 1, obj);
//                     break;
//                   }else{
//                     if (fc.indexOf(it)==fc.length-1) {
//                       fc.push(obj)
//                     }
//                   }
//                 }
//               }


//           }

//           fc.sort((obj1, obj2) => obj1.date - obj2.date)
//       })
    
//       .catch(err => console.log(err))
// }

// create(url)

  

/*                                                              
function email(email){
    let nom=email.split('@')
    nom=nom[0].replace("."," ")             Choper nom a partir d'email
    console.log(nom)
}

mel = "tom.zigouigoui@tegugst.com"

email(mel)
*/