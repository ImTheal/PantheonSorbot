const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
    calendar: {type: mongoose.Schema.Types.ObjectId, ref: 'calendar'},
    dateJour: Date,
    heureDebut: Date,
    heureFin: Date
})

//here to deploy methods

const Classe = mongoose.model('Classe',classeSchema);

module.exports = {
    classeSchema, Classe
}