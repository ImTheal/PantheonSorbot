const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    email: String,
    code : String
})

//here to deploy methods

const Code = mongoose.model('Code', codeSchema);

module.exports = {
    codeSchema, Code
}