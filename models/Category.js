const mongoose  = require("mongoose");

const categorySchema = new mongoose.Schema({

    name :{
        type: String,
    },
    description :{
        type : String,
    },
    projects :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : "Project",
        }
    ]

});

module.exports = mongoose.model("Category" , categorySchema);