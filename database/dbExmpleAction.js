const stuctDb = require('./databaseArchi/initialiseArchi');
const libConnection = require('./mongoose-connection');
const { mongoose } = libConnection;

const getAllMembers = () => {
  stuctDb.Member.find(function (err, members) {
    if (err) return console.error(err);
    return console.log(members);
  })
}

module.exports = {
  getAllMembers
}

