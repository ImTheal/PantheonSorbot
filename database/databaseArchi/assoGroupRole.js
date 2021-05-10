const mongoose = require('mongoose');

const assoGroupRoleSchema = new mongoose.Schema({
    Group:{type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    Role:{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}
})

//here to deploy methods

const AssoGroupRole = mongoose.model('AssoGroupRole',assoGroupRoleSchema);

module.exports = {
    assoGroupRoleSchema, AssoGroupRole
}