const mongoose = require('mongoose');

const assoMemberGroupSchema = new mongoose.Schema({
    Member: {type: mongoose.Schema.Types.ObjectId, ref: 'Member'},
    Group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
})

//here to deploy methods

const AssoMemberGroup = mongoose.model('AssoMemberGroup',assoMemberGroupSchema);

module.exports = {
    assoMemberGroupSchema, AssoMemberGroup
}