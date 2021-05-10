const libConnection = require('./mongoose-connection');
libConnection.run().then(() =>{
        const lib = require('./dbExmpleAction');
        lib.getAllMembersDB().then((members) =>{
            console.log(members);
        })
})
