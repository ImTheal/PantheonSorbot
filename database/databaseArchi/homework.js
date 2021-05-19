const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
    name: String,
    _channel: String,
    _guild: String,
    _teacher: String,
    _group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    description: String,
    type: String,
    renderingDate: Date,
    channelDeleted: { type: Boolean, default: false }
})

const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = {
    homeworkSchema,
    Homework
}