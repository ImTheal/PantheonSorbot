const mongoose = require('mongoose')

mongoose.Promise = Promise

mongoose.connection.on('connected', () => {
    console.log('Connection Established')
})

mongoose.connection.on('reconnected', () => {
    console.log('Connection Reestablished')
})

mongoose.connection.on('disconnected', () => {
    console.log('Connection Disconnected')
})

mongoose.connection.on('close', () => {
    console.log('Connection Closed')
})

mongoose.connection.on('error', (error) => {
    console.log('ERROR: ' + error)
})

const run = async() => {

    const uri = "mongodb+srv://iris:J6pokmIBoDqb7vGj@cluster0.pcqhm.mongodb.net/test?retryWrites=true&w=majority";
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = { run, mongoose }