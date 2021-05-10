const libConnection = require('./mongoose-connection');
libConnection.run().then(() =>{
        const lib = require('./databaseFunction/dbFunctions');
        lib.getAllMembersDB().then((members) =>{
            console.log(members);
        })
})
