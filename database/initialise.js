
const mongoose = require('mongoose');
const uri = "mongodb+srv://maxime:C3tBA7z7K1LjQfdJ@apptest.mrazn.mongodb.net/test?retryWrites=true&w=majority";
const client = new mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  console.log("hello !");
    
  const memberSchema = new mongoose.Schema({
      idDiscord: String,
      firstname: String,
      lastname: String,
      email: String,
      checked: Boolean
  })

  const Member = mongoose.model('Member', memberSchema);

  const codeSchema = new mongoose.Schema({
      email: String,
      code : String
  })

  const Code = mongoose.model('Code', codeSchema);

  const calendrierSchema = new mongoose.Schema({
      name: String,
      anneeStart: String,
      anneeEnd: String
  })

  const Calendrier = mongoose.model('Calendrier',calendrierSchema);

  const coursSchema = new mongoose.Schema({
      Calendrier: {type: mongoose.Schema.Types.ObjectId, ref: 'Calendrier'},
      dateJour: Date,
      heureDebut: Date,
      heureFin: Date
  })

  const Cours = mongoose.model('Cours',coursSchema);

  const groupSchema = new mongoose.Schema({
      name: String,
  })

  const Groupe = mongoose.model('Groupe',groupSchema);

  const roleSchema = new mongoose.Schema({
      name: String,
      Calendrier:{type: mongoose.Schema.Types.ObjectId, ref: 'Calendrier'}
  })   

  const Role = mongoose.model('Role',roleSchema);

  const assoGroupRole = new mongoose.Schema({
      Group:{type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
      Role:{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}
  })

  const AssoGroupRole = mongoose.model('AssoGroupRole',assoGroupRole);

  const assoUserGroupSchema = new mongoose.Schema({
      name: {type: mongoose.Schema.Types.ObjectId, ref: 'Member'},
      Group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  })   

  const AssoUserGroupSchema = mongoose.model('AssoUserGroupSchema',assoUserGroupSchema);

});
