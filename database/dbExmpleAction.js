const stuctDb = require('./databaseArchi/initialiseArchi');
const libConnection = require('./mongoose-connection');

const getAllMembersDB = async () => {
  const members = await stuctDb.Member.find({}).exec();
  return members;
}

module.exports = {
  getAllMembersDB
}

