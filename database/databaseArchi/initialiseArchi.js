const { Member, memberSchema } = require('./member');
const { Code, codeSchema } = require('./code');
const { Class, classSchema } = require('./class');
const { Group, groupSchema } = require('./group');
const { Role, roleSchema } = require('./role');
const { AssoGroupRole, assoGroupRoleSchema } = require('./assoGroupRole');
const { AssoMemberGroup, assoMemberGroupSchema } = require('./assoMemberGroup');
const { Homework, homeworkSchema } = require('./homework');
const { AssoMemberHomework, assoMemberHomeworkSchema } = require('./assoMemberHomework');

module.exports = {
    memberSchema,
    Member,
    codeSchema,
    Code,
    classSchema,
    Class,
    groupSchema,
    Group,
    roleSchema,
    Role,
    assoGroupRoleSchema,
    AssoGroupRole,
    assoMemberGroupSchema,
    AssoMemberGroup,
    homeworkSchema,
    Homework,
    assoMemberHomeworkSchema,
    AssoMemberHomework
};