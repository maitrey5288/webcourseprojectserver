const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

//cookie-parser - what is this and why we need this ?

 

app.use(express.json());
 
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
require("./config/database").connect();
const cloudinary = require('./config/cloudinary')
cloudinary.cloudinaryConnect();
//route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

//activate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})