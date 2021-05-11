const stuctDb = require('../databaseArchi/initialiseArchi');

const getAllMembersDB = async () => {
  const members = await stuctDb.Member.find({}).exec();
  return members;
}

const createAndGetOneGroupDB = async () => {
  const group = await stuctDb.Group.findOne({name: 'lala'}).exec();
  return group;
}

const getAllCalendarsDB = async () => {
  const group = await stuctDb.Calendar.find({}).exec();
  return group;
}

const getAllRolesDB = async () => {
  const group = await stuctDb.Calendar.find({}).exec();
  return group;
}

const getRolefromGroupDB = async (id) => {
  const roles = await stuctDb.AssoGroupRole.find({Group: id}).exec();
  console.log(roles);
  return group;
}

const createRoles = async () => {

}




module.exports = {
  getAllMembersDB, createAndGetOneGroupDB, getAllCalendarsDB
}

