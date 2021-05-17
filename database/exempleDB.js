const libConnection = require('./mongoose-connection');
libConnection.run().then(async () =>{
        const lib = require('./databaseFunction/dbFunctions');
        const member={
            idDiscord:null,
            firstname:'jean',
            lastname:'valjean',
            email:'tamerelatchoin@gjruhgr.crjigjr',
            checked:false                    
        }
        const mem=await lib.checkMemberDB(member)
        console.log(mem);
        if(mem){
            lib.deleteGroupsOfMember(mem)
            lib.addMemberInGroup(mem,'M1APP')
        }else{
            lib.createMemberAndAddInGroup(member, 'M1APP')
        }
})
