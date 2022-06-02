const mongoose = require("mongoose")

const materialSchema = new mongoose.Schema({
    filePath : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    dept : {
        type : String,
        required : true
    },
    year: {
        type : Number,
        required:true
    },
    postedStaff : {
        type : String,
        required : true
    },
    postedTime : {
        type : Date,
        required: true
    }
})

module.exports = mongoose.model("material",materialSchema)