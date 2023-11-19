const mongoose  = require("mongoose");

const investmentSchema = new mongoose.Schema({

    user  : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
 
    title:{
        type:String,
    },
    about :{
        type : String,
    },
     
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
    },
    
    deadline:{
        type:Date
    },
    thumbnail: { 
            type:String
        },
    createdAt:{
        type:Date,
        default : Date.now()
    }


});

module.exports = mongoose.model("Investment" , investmentSchema);