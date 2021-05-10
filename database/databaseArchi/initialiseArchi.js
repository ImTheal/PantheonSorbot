
const { Member, memberSchema } = require('./member');
const { Code, codeSchema } = require('./code');
const { Calendar, calendarSchema } = require('./calendar');
const { Classe, classeSchema } = require('./classe');
const { Group, groupSchema } = require('./group');
const { Role, roleSchema } = require('./role');
const { AssoGroupRole, assoGroupRoleSchema } = require('./assoGroupRole');
const { AssoMemberGroup, assoMemberGroupSchema } = require('./assoMemberGroup');

module.exports = {
  memberSchema, Member,
  codeSchema, Code,
  calendarSchema, Calendar,
  classeSchema, Classe,
  groupSchema, Group,
  roleSchema, Role,
  assoGroupRoleSchema, AssoGroupRole,
  assoMemberGroupSchema, AssoMemberGroup,
};