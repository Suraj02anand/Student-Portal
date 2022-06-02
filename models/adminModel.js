const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const adminSchema = new mongoose.Schema({
    username : {
        type : String, 
        required : true
    }, 
    password : {
        type : String , 
    },
    accountType : {
        type : String,
        required : true
    }
})

adminSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("admin", adminSchema);