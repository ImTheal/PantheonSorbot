const mongoose = require('mongoose');

const assoMemberHomeworkSchema = new mongoose.Schema({
    _member: String, //{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    _homework: { type: mongoose.Schema.Types.ObjectId, ref: 'Homework' },
    response: String
})

const AssoMemberHomework = mongoose.model('AssoMemberHomework', assoMemberHomeworkSchema);

module.exports = {
    assoMemberHomeworkSchema,
    AssoMemberHomework
}