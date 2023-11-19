const mongoose  = require("mongoose");

const profileSchema = new mongoose.Schema({

    gender : { 
        Type:String,

    },
    dateOfBirth : {
        type:Date,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber : {
        type : Number,
        trim :true,
    },
    profilePicture :{
        type : String,
       
    },
    projects : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : "Project",
        }
    ],
    investedProjects : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Project"
        }
    ] ,
    likedProjects : [
        {
        
                type : mongoose.Schema.Types.ObjectId,
                ref : "Project"
           
        }
    ],
    investmentOP:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Investment'
        }
    ],
    invitedProjects : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Project'
        }
    ]


});

module.exports = mongoose.model("Profile" , profileSchema);