const {getAllMembersDB, getAllMembersFromRole, isTheProf, getClassById, isClassNow, getAllRolesFromMemberID, createAndGetOneGroupDB, getAllClassesFromMember, getMemberByDiscordId, getGroupByName, createAssoMemberGroup, getAllRolesDB, getNameFromIdMember} = require('./dbExmpleAction');

module.exports = {
    getAllMembersDB,
    getClassById,
    isClassNow,
    createAndGetOneGroupDB,
    getAllRolesFromMemberID,
    getAllClassesFromMember,
    getMemberByDiscordId,
    getGroupByName,
    createAssoMemberGroup,
    getAllRolesDB,
    getNameFromIdMember,
    isTheProf,
    getAllMembersFromRole
}