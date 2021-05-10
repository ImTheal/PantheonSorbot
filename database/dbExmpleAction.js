const stuctDb = require('./databaseArchi/initialiseArchi');

const getAllMembersDB = async () => {
  const members = await stuctDb.Member.find({}).exec();
  return members;
}



module.exports = {
  getAllMembersDB
}

