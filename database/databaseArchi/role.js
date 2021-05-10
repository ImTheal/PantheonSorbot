const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: String,
    calendar:{type: mongoose.Schema.Types.ObjectId, ref: 'calendar'}
})

//here to deploy methods

const Role = mongoose.model('Role',roleSchema);

module.exports = {
    roleSchema, Role
}