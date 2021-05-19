const libConnection = require('./mongoose-connection');
const db = require('./databaseArchi/initialiseArchi');
const fx = require('./databaseFunction/dbFunctions')
const mongoose = require('mongoose');

libConnection.run().then(() => {
    const roleName = 'L3APP'
    fx.getAllMembersFromRole(roleName).then(students => {
        console.log(students)
    })
})