const structDb = require('../databaseArchi/initialiseArchi');

const getAllMembersDB = async () => {
  const members = await structDb.Member.find({}).exec();
  return members;
}

const createAndGetOneGroupDB = async () => {
  const group = await structDb.Group.findOne({name: 'lala'}).exec();
  return group;
}

const getAllCalendarsDB = async () => {
  const group = await structDb.Calendar.find({}).exec();
  return group;
}

cosnt getAllClassesFromMember = async(id) => {
  const member = await structDb.Member.findOne({}).exec();
  const allAssoGroupRole = await structDb.AssoMemberGroup.find({Member: member});
  let lala;
  allAssoGroupRole.forEach(element => {
    const listIdClasses = element.classes;
    await  
  });

}

const getAllRolesDB = async () => {
  const group = await structDb.Calendar.find({}).exec();
  return group;
}

const getRolefromGroupDB = async (id) => {
  const roles = await structDb.AssoGroupRole.find({Group: id}).exec();
  console.log(roles);
  return group;
}

const createRoles = async () => {

}




module.exports = {
  getAllMembersDB, createAndGetOneGroupDB, getAllCalendarsDB
}

