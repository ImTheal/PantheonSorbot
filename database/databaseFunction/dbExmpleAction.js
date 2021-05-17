const structDb = require('../databaseArchi/initialiseArchi');

const getAllMembersDB = async () => {
  const members = await structDb.Member.find({}).exec();
  return members;
}

const checkMemberDB = (member) => {
  return new Promise((resolve) => {
    structDb.Member.findOne({firstname: member.firstname, lastname: member.lastname, email: member.email}).exec()
    .then((member) =>{
      if(member){
        resolve(member) 
      }else{
        resolve(false) 
      }
    })
  })
}

const deleteGroupsOfMember = (member) => {
  structDb.AssoMemberGroup.findOneAndDelete({Member:member}).exec()
}


const checkMemberAndDeleteGroupsIfExists= (member) =>{
  const mem=checkMemberDB(member)
  if (mem) {
    deleteGroupsOfMember(mem)
  } else {
    
  }
}


const addMember = (member) => {
  const newMember= new structDb.Member(member)
  return newMember.save()
}

const addMemberInGroup = (member, groupName) => {
  structDb.Group.findOne({name:groupName}).exec().then((group) =>{
    new structDb.AssoMemberGroup({Member:member, Group:group}).save()
  })
}

const createMemberAndAddInGroup = (member, groupName) => {
  addMember(member).then((value)=>{
    addMemberInGroup(value, groupName)
  })
}

module.exports = {
  getAllMembersDB,
  createMemberAndAddInGroup,
  checkMemberAndDeleteGroupsIfExists,
  deleteGroupsOfMember,
  checkMemberDB,
  addMemberInGroup
}

