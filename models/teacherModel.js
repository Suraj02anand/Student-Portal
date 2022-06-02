const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const teacherSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
    },
    staffName : {
        type : String,
        required : true
    },
    mobileNumber : {
        type : Number,
        required : true
    },
    departmentHandled : {
        type : [{
            type : String
        }],
        required : true
    }, 
    accountType : {
        type : String, 
        required : true
    } 
})

teacherSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("teacher",teacherSchema);