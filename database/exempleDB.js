const libConnection = require('./mongoose-connection');
const db = require('./databaseArchi/initialiseArchi');
const mongoose = require('mongoose');

libConnection.run().then(() => {
    const lib = require('./databaseFunction/dbFunctions');
    lib.getAllClassesFromMember('172711011688775681').then(r =>{
        console.log(r)
    });
})