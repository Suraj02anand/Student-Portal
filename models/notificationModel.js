const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    notificationTitle : {
        type : String,
        required : true
    },
    notificationMessage : {
        type : String,
        required : true
    },
    department : {
        type : String , 
        required : true
    },
    year : {
        type : Number,
        required : true
    },
    postedTime : {
        type : Date,
        required : true
    },
    staffName :  {
        type : String,
        required : true
    },
    username :  {
        type : String,
        required : true
    }
})

module.exports = mongoose.model("notification",notificationSchema)