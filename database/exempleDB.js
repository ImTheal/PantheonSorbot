const libConnection = require('./mongoose-connection');
const db = require('./databaseArchi/initialiseArchi');
const fx = require('./databaseFunction/dbFunctions')
const mongoose = require('mongoose');

libConnection.run().then(() => {
    fx.getMemberByName('Maxime','Pierront').then(students => {
        console.log(students)
    })
})