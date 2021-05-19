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

const run = async () => {
  const uri = 'mongodb+srv://nicolas:TJE7ZhXvQKSro4SD@testnico.bakbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  await mongoose.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
}

module.exports	= { run, mongoose }