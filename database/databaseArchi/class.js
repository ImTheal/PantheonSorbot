const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    subject: String,
    prof:{type: mongoose.Schema.Types.ObjectId, ref: 'Member'},
    dateDebut: Date,
    dateFin: Date
})

//here to deploy methods

const Class = mongoose.model('Class',classSchema);

module.exports = {
    classSchema, Class
}