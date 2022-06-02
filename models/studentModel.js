const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")

const studentSchema = new mongoose.Schema({
    username : {
        type : Number,
        required : true
    },
    studentName : {
        type : String,
        required : true
    },
    mobileNumber : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    department : {
        type : String,
        required : true
    },
    year : {
        type : Number,
        required : true
    },
    password : {
        type : String,
    }, 
    accountType : {
        type : String, 
        required : true
    }
})

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student",studentSchema)