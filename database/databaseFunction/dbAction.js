  
const stuctDb = require('../databaseArchi/initialiseArchi');

const setCodeDB = async (code, memberMail) =>
{
    const aCode = new stuctDb.Code({
        email: memberMail,
        code : code,
      });
      aCode.save();

      return true;
};

const setMemberChecked = async (memberMail) =>
{
    const filter = { email: memberMail };
    const update = { checked: true };
    const doc = await stuctDb.Member.findOneAndUpdate(filter, update, {
        new: true,
    });
    
    return doc;
};

module.exports = {
    setCodeDB,
    setMemberChecked,
};