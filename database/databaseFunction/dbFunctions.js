const {getAllMembersDB, findAndUpdateClass, getAllClasses, getRoleByName, addClass, getMemberByName, getAllMembersFromRole, isTheProf, getClassById, isClassNow, getAllRolesFromMemberID, createAndGetOneGroupDB, getAllClassesFromMember, getMemberByDiscordId, getGroupByName, createAssoMemberGroup, getAllRolesDB, getNameFromIdMember} = require('./dbExmpleAction');
const {
    getMemberByDiscordIdDB,
    getGroupIdByNameDB
} = require('./dbExmpleAction');

module.exports = {
    getAllMembersDB,
    getClassById,
    isClassNow,
    getMemberByName,
    createAndGetOneGroupDB,
    getAllRolesFromMemberID,
    getAllClassesFromMember,
    getMemberByDiscordId,
    getGroupByName,
    createAssoMemberGroup,
    getAllRolesDB,
    getNameFromIdMember,
    isTheProf,
    getAllMembersFromRole,
    addClass,
    getRoleByName,
    getAllClasses,
    findAndUpdateClass,
    getAllMembersFromRole,
    getMemberByDiscordIdDB,
    getGroupIdByNameDB
}