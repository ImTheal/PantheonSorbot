const libConnection = require('./mongoose-connection');
const db = require('./databaseArchi/initialiseArchi');
libConnection.run().then(() =>{
        const lib = require('./databaseFunction/dbFunctions');
        lib.createAndGetOneGroupDB().then((group) => {
            console.log(group);
            lib.getAllCalendarsDB().then((calendars) => {
                console.log(calendars);
                let a = 1;
                
            })
        })

        


})
