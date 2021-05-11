const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
    prof:{type: mongoose.Schema.Types.ObjectId, ref: 'Member'},
    dateDebut: Date,
    dateFin: Date
})

//here to deploy methods

const Classe = mongoose.model('Classe',classeSchema);

module.exports = {
    classeSchema, Classe
}