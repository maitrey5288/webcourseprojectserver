const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    firstName : {
        type :String,
    },
    lastName : {
        type : String,
    },
    email : {
        type :String,
    },
    password : {
        type :String,
        required : true,
    

    },
    accountType:{
        type:String,
        enum:["Admin" , "ProjectOwner","Investor"],
        required : true,
    },
    profile : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : "Profile",
    },
    isEmailVerified :{
        type : String,
        enum : ['yes','no'],
        required : true,
    }





})

module.exports = mongoose.model("User", UserSchema);