const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: String,
    calendar:[Schema.Types.ObjectId]
})

//here to deploy methods

const Role = mongoose.model('Role',roleSchema);

module.exports = {
    roleSchema, Role
}