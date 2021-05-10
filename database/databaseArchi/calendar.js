const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    name: String,
    anneeStart: String,
    anneeEnd: String
})

//here to deploy methods

const Calendar = mongoose.model('calendar',calendarSchema);

module.exports = {
    calendarSchema, Calendar
}