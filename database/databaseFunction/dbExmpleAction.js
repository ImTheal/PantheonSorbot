const structDb = require('../databaseArchi/initialiseArchi');
const mongoose = require("mongoose");

const getAllMembersDB = async () => {
    const members = await structDb.Member.find({}).exec();
    return members;
}

const createAndGetOneGroupDB = async () => {
    const group = await structDb.Group.findOne({name: 'lala'}).exec();
    return group;
}

const isClassNow = (role,subj) =>{
    return new Promise(resolve => {
        structDb.Role.findOne({name:role+' élève'}).exec().then(res => {
            const calendar = res.calendar;
            const today = new Date(Date.now());
            structDb.Class.find({
                subject:subj,
                dateDebut: { $lt: today},
                dateFin: { $gt: today}
            }).exec().then(async (value) => {
                for (const val of value) {
                    if (calendar.indexOf(val)){
                        resolve(val);
                    }
                }
                return null;
            })
        })
    })
}

const isTheProf = (id,discordId) =>{
    return new Promise(resolve =>{
        structDb.Member.findOne({_id:mongoose.Types.ObjectId(id)}).exec().then(value => {
            if (value.idDiscord === discordId){
                resolve(value);
            } else {
                resolve(false);
            }
        })
    })
}

const getRoleFromAsso = (assos) => {
    return new Promise(((resolve) => {
        let promises = [];
        assos.forEach((asso) => {
            const id = mongoose.Types.ObjectId(asso.Role);
            promises.push(getRoleById(id))
        })
        Promise.all(promises).then(value => {
            resolve(value);
        })
    }))
}

function getClassById(_id) {
    return structDb.Class.findById({_id}).exec();
}

const getNameFromIdMember = (_id) => {
    return new Promise((resolve) => {
        structDb.Member.findById({_id}).exec().then((member) => {
            resolve(member.firstname + ' ' + member.lastname);
        });
    })
}


const getClasesById = (calendar) => {
    console.log(calendar)
    return new Promise((resolve) => {
        let promises = [];
        calendar.forEach((classId) => {
            const id = mongoose.Types.ObjectId(classId);
            promises.push(getClassById(id))
        })
        Promise.all(promises).then(value => {
            resolve(value);
        })
    })

}

function getClasses(element) {
    return new Promise((resolve) => {
        const idMember = mongoose.Types.ObjectId(element.prof);
        getNameFromIdMember(idMember).then((name) => {
            const subject = element.subject;
            const dateD = element.dateDebut
            const dateF = element.dateFin
            resolve({
                subject,
                name,
                dateD,
                dateF
            })
        })
    })
}

function fillClasswithProfName(r) {
    return new Promise((resolve) => {
        let promises = []
        r.forEach(element => {
            promises.push(getClasses(element));
        })
        Promise.all(promises).then(values => {
            resolve(values);
        })
    })
}

function getMemberById(_id) {
    return structDb.Member.findOne(_id).exec();
}

const getAllMembersFromRole = (roleName) => {
    return new Promise(resolve => {
        structDb.Role.findOne({name:roleName+' élève'}).exec().then(role => {
            structDb.AssoGroupRole.findOne({Role:role}).exec().then(asso => {
                structDb.AssoMemberGroup.find({Group:asso.Group}).exec().then(asso2 => {
                    let promises = [];
                    asso2.forEach(element =>{
                        const _id = mongoose.Types.ObjectId(element.Member);
                        promises.push(getMemberById(_id));
                    })
                    Promise.all(promises).then(students => {
                        resolve(students);
                    })
                })
            })
        })
    })
}

const getAllClassesFromMember = (id) => {
    return new Promise(resolve => {
        getMemberByDiscordId(id).then((member) => {
            getAssoGroupFromMember(member).then(assos => {
                getAssoRolefromGroupDB(assos[0].Group).then(assos => {
                    getRoleFromAsso(assos).then(value => {
                        let calendar = [];
                        value.forEach(v => {
                            const items = v.calendar;
                            calendar = calendar.concat(items);
                        })
                        getClasesById(calendar).then(result => {
                            resolve(fillClasswithProfName(result));
                        })
                    });
                });
            });
        })
    })
}

const getAllClasses = () =>{
    return structDb.Class.find({}).exec();
}

const addClass = (newClass) =>{
    const classToAdd = new structDb.Class(newClass);
    return classToAdd.save();
}


const getMemberByName = (firstname, lastname) => {
    return structDb.Member.findOne({firstname, lastname}).exec();
}

const getAllRolesFromMemberID = (id) => {
    return new Promise(resolve => {
        getMemberByDiscordId(id).then((member) => {
            getAssoGroupFromMember(member).then(assos => {
                getAssoRolefromGroupDB(assos[0].Group).then(assos => {
                    getRoleFromAsso(assos).then(value => {
                        resolve(value);
                    });
                });
            });
        })
    })
}

const getRoleById = (_id) => {
    const query = structDb.Role.findById({_id}).exec();
    return query;
}

const getRoleByName = (roleName) =>{
    return structDb.Role.findOne({name:roleName}).exec();
}

const getAssoGroupFromMember = (member) => {
    const assos = structDb.AssoMemberGroup.find({Member: member}).exec();
    return assos;
}


const getAllRolesDB = () => {
    const query = structDb.Role.find({}).exec();
    return query;
}

const getAssoRolefromGroupDB = (group) => {
    const assos = structDb.AssoGroupRole.find({Group: group}).exec();
    return assos;
}

const getMemberByDiscordId = (id) => {
    return structDb.Member.findOne({idDiscord: id}).exec();
}



const getGroupByName = (name) => {
    return structDb.Group.findOne({name: name}).exec();
}

const createAssoMemberGroup = (member, group) => {
    const asso = new structDb.AssoMemberGroup({
        Member: member,
        Group: group
    });
    asso.save();
    return asso;
}


module.exports = {
    getAllMembersDB,
    getNameFromIdMember,
    createAndGetOneGroupDB,
    getAllClassesFromMember,
    getMemberByDiscordId,
    getGroupByName,
    createAssoMemberGroup,
    getAllRolesDB,
    getAllRolesFromMemberID,
    getClassById,
    isClassNow,
    isTheProf,
    getAllMembersFromRole,
    getMemberByName,
    addClass,
    getRoleByName,
    getAllClasses
}

