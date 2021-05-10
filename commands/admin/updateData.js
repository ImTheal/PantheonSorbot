module.exports = {
    commands: 'updatedata',
    description: 'permet de recuperer les donnees des fichiers spreadsheets',
    minArgs: 0,
    maxargs: 0,
    expectedArgs: "",
    requiredRoles: '',
    callback: (message, arguments) => {
        const config = require(`${racine}/config.json`);
        
        create(config.cours)

        
    },
  }

  async function makeURL(id){
    return `https://spreadsheets.google.com/feeds/list/${id}/1/public/full?alt=json`
  }

  function create(link){
    const id=link.substring(39, 83)
    const url=`https://spreadsheets.google.com/feeds/list/${id}/1/public/full?alt=json`
    let str=''
    let fc=[]
    fetch(url,{method: 'GET'})
      .then(response => response.json())
      .then(json => json.feed.entry)
      .then(entry => {
          for (const iterator of entry) {
              let parsedDate=iterator.gsx$date.$t.split('/')
              let date=new Date(20+parsedDate[2],parsedDate[1],parsedDate[0]).getTime()
              let dateDebut=date+getMsFromHour(iterator.gsx$heuredebut.$t)
              let dateFin=dateDebut+getMsFromHour(iterator.gsx$heurefin.$t)
              let ligne=`{"datedebut":${dateDebut},"datefin":${dateFin},"cours":"${iterator.gsx$cours.$t}","prof":"${iterator.gsx$prof.$t}"}`
              let obj=JSON.parse(ligne)
            fc.push(obj) 
          }

          fc.sort((obj1, obj2) => obj1.date - obj2.date)

          console.log(fc)
          console.log(fc.length)
      })
    
      .catch(err => console.log(err))

      function getMsFromHour(hr){
        data=hr.split(':')
        let hour=data[0]
        let minutes=data[1]
        return hour*3600000+minutes*60000
      }
}