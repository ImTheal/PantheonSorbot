const libConnection = require('./mongoose-connection');
libConnection.run().then(() => {
    const lib = require('./dbExmpleAction');
    var members = lib.getAllMembers();
    console.log(members);
})


