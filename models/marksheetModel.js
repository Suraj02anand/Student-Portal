const mongoose = require("mongoose")


const subjectRow = new mongoose.Schema({
    subjectPart : {
        type : Number,
        required : true
    },
    subjectCode : {
        type : String,
        required : true
    },
    subjectTitle : {
        type : String,
        required : true
    },
    subjectCredit : {
        type : Number , 
        required : true
    },
    subjectCIA : {
        type : Number,
        required : true
    },
    subjectESE : {
        type : Number,
        required : true
    }
})

const marksheetSchema = new mongoose.Schema({
    department : {
        type : String , 
        required : true
    },
    studentName : {
        type : String,
        required : true
    },
    studentRegisterNumber : {
        type : Number,
        required : true
    },
    semester : {
        type : String,
        required : true
    },
    subjects : [subjectRow]
})


module.exports = mongoose.model("marksheet",marksheetSchema)