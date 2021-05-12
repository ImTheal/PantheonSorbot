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
                        getClasesById(calendar).then(r => {
                            resolve(r);
                        })
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
    createAndGetOneGroupDB,
    getAllClassesFromMember,
    getMemberByDiscordId,
    getGroupByName,
    createAssoMemberGroup,
    getAllRolesDB
}

