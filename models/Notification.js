const mongoose  = require("mongoose");

const notificationSchema = new mongoose.Schema({

    text:{
        type:String,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    type:{
        type:String
    },
    createdAt : {
        type:Date,
        default : Date.now()
    }


   


});

module.exports = mongoose.model("Notification" , notificationSchema);