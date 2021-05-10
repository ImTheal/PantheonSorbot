const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    idDiscord: String,
    firstname: String,
    lastname: String,
    email: String,
    checked: Boolean
})

//here deploy methods

const Member = mongoose.model('Member', memberSchema);

module.exports = {
    memberSchema, Member
}