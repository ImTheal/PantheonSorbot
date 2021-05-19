const structDb = require('../databaseArchi/initialiseArchi');

const getAllMembersDB = async() => {
    const members = await structDb.Member.find({}).exec();
    return members;
}

const getMemberByDiscordIdDB = async(id) => {
    return await structDb.Member.findOne({ idDiscord: id }).exec();
}

const getGroupIdByNameDB = (name) => {
    return structDb.Group.findOne({ name }, '_id').exec();
}

module.exports = {
    getAllMembersDB,
    getMemberByDiscordIdDB,
    getGroupIdByNameDB
}