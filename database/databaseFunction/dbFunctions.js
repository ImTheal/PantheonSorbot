const {getAllMembersDB, findAndUpdateClass, getAllClasses, getRoleByName, addClass, getMemberByName, getAllMembersFromRole, isTheProf, getClassById, isClassNow, getAllRolesFromMemberID, createAndGetOneGroupDB, getAllClassesFromMember, getMemberByDiscordId, getGroupByName, createAssoMemberGroup, getAllRolesDB, getNameFromIdMember,createMemberAndAddInGroup,checkMemberAndDeleteGroupsIfExists,deleteGroupsOfMember,checkMemberDB,addMemberInGroup} = require('./dbExmpleAction');
const {
    getMemberByDiscordIdDB,
    getGroupIdByNameDB
} = require('./dbExmpleAction');
const { setCodeDB } = require('./dbAction');
const { setMemberChecked } = require('./dbAction');

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
    getGroupIdByNameDB,
    createMemberAndAddInGroup,
    checkMemberAndDeleteGroupsIfExists,
    deleteGroupsOfMember,
    checkMemberDB,
    addMemberInGroup,
    setCodeDB,
    setMemberChecked,
}