const mongoose  = require("mongoose");

const projectSchema = new mongoose.Schema({

    name :{
        type: String,
    },
    type :{
        type : String,
        enum:["Hardware" , "Software"],
        required : true,
    },
    description :{
        type :String,
    },
    thumbnail : {
        type: String,
    },
    images : [
        {
            type :String,
        }
    ],
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
    },
    tags : [
        {
            type :  String,
        },
    ],
    teamMembers : [
        {
             type : mongoose.Schema.Types.ObjectId,
             ref : "User",
        }
    ],
    expectedInvestment :{
        type: Number,
    },
    investedBy : [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    githubLink : {
        String,
    },
    likesCount : {
        type : Number,
        Default :0,
    },
    createdAt :{
        type :Date,
        default :Date.now()
    },
    

         


});

module.exports = mongoose.model("Project" , projectSchema);