const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
})

//here to deploy methods

const Group = mongoose.model('Groupe',groupSchema);

module.exports = {
    groupSchema, Group
}