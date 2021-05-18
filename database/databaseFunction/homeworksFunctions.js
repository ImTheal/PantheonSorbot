const structDb = require('../databaseArchi/initialiseArchi');

const addHomeworkDB = async(item) => await structDb.Homework(item).save();

const addHomeworkToStudentDB = async({ _homework, _member, response }) => {
    return await structDb.AssoMemberHomework.findOne({ _homework, _member }).exec()
        .then(res => {
            if (res) {
                return structDb.AssoMemberHomework.updateOne({ _homework, _member }, { response })
            } else {
                return new structDb.AssoMemberHomework({ _homework, _member, response }).save()
            }
        });
}

const getExpiredHomeworksDB = async() => {
    const now = new Date();
    return await structDb.Homework.find({
        renderingDate: {
            $lt: now
        },
        channelDeleted: false
    }, '_id name _channel _teacher _guild').exec();
}

const getHomeworkInfosDB = async(_homework) => await structDb.Homework.findOne({ _id: _homework }).exec();

const updateHomeworkChannelsDB = async(_homeworks) => structDb.Homework.updateMany({ _id: _homeworks }, { channelDeleted: true });

const getHomeworkResponsesDB = async(_homework) => await structDb.AssoMemberHomework.find({ _homework }, '_member response').exec();

const checkHomeworkNameDB = async(name) => {
    return await structDb.Homework.findOne({ name })
        .exec()
        .then(res => res ? res : false)
}

const hasRightsOnHomeworkDB = async(_user, _homework) => {
    return await structDb.Homework.findOne({ _id: _homework }, '_teacher')
        .exec()
        .then(res => res._teacher === _user)
}

const deleteHomeworkDB = async(_homework) => {
    return Promise.all([
            structDb.Homework.deleteOne({ _id: _homework }).exec(),
            structDb.AssoMemberHomework.deleteMany({ _homework }).exec()
        ]).then(() => true)
        .catch(() => false)
}

const changeHomeworkNameDB = async(_homework, name) => {
    return await structDb.Homework.updateOne({ _id: _homework }, { name })
}

module.exports = {
    addHomeworkDB,
    addHomeworkToStudentDB,
    getExpiredHomeworksDB,
    updateHomeworkChannelsDB,
    getHomeworkResponsesDB,
    getHomeworkInfosDB,
    checkHomeworkNameDB,
    hasRightsOnHomeworkDB,
    deleteHomeworkDB,
    changeHomeworkNameDB
}