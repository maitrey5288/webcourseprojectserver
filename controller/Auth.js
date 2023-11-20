 const bcrypt = require("bcryptjs")
 const nodemailer = require('nodemailer')

 const User = require("../models/user");
 const category = require("../models/Category")
 
 const project= require("../models/Project.js")
const jwt = require('jsonwebtoken');
const Profile = require("../models/Profile");
require("dotenv").config()

exports.signup = async (req,res) => {
    try {
        const {firstName,lastName,email,password,accountType,} = req.body;
        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({
                success : false,
                message : 'user already exists',
            });
        }
        let hashpass;
        try{
            hashpass = await bcrypt.hash(password,10);

        }
        catch(err){
            return res.status(500).json({
                success:false,
                message : 'error in hashing password',
            });
        }

        const profileDetils = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber :null,
            profilePicture:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        const user = await User.create({
            firstName,lastName,email,password:hashpass,accountType,profile : profileDetils._id, isEmailVerified:'no'  
        })
        
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
        const payload = {
            email : email,
            
        }
        let token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:'2h',
        });

        //send mail
        let info = await transporter.sendMail ({
            from: `Sparktank`,
            to: req.body.email,
            subject: "Confirmation mail for New user register",
            html: `<h1>hi</h1>    <a href="http://localhost:3000/confirmMail/${token}">Click here to proceed</a> `
    
        })

        console.log(info)
        return res.status(200).json({
            success:true,
            message: 'user created succesfully',
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false,
            message : 'user cannot be registered, please try again later', 
        });
    }
}




//login
exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Please fill all the details"
            });
        }

        let user  = await User.findOne({email}).populate({path:'profile'}).exec();

        if(!user){
            return res.status(401).json({
                success:false,
                message: 'user is not registered'
            })
        }
        if(user.isEmailVerified == 'no'){
            return res.status(404).json({
                success :false,
                message : "Email id is not verified"
            })
        }
        const payload = {
            email : user.email,
            id : user._id,
            role : user.accountType,
        }

        //verify password and generate jwt token
        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h',
            });

            user=user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3 * 24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token",token,options ).status(200).json({
                success:true,
                token,
                user,
                message : 'user logged in successfully',
            });

        }
        else{
            //pass not match
            return res.status(403).json({
                success:false,
                message: "Password Incorrect"
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message : 'login failure',
        });
    }
}

exports.getUserData = async (req,res) => {


    try {
        
        const user = await User.findById(req.user.id).populate({path : "profile"}).exec()
        user.password = undefined ;
 
        return res.status(200).json({
            success:true,
            user : user
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message : 'unable to fetch userdata',
        });
    }


}


exports.confirmMail = async (req,res) => {
    try
  { 
     
    const token = req.body.token;

    const decode = jwt.verify(token,process.env.JWT_SECRET);
    if(!decode){
        return res.status(400).json({
            success :false,
            message : "token is invalid"
        })
    }
    console.log("j1")
    const user = await User.findOneAndUpdate({email : decode.email},{isEmailVerified:'yes'})

    if(!user){
        return res.status(400).json({
            success :false,
            message : "User not exists"
        })
    }

    return res.status(200).json({
        success:true,
        message:"email verification successfull"
    })
}
catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message : 'error occured',
    });
}



    
}

exports.updateProfile = async(req,res) => {
    try
  { 
     
    const user = req.user;
    const {dateOfBirth,about,contactNumber,gender} = req.body ;
     const userDetails = await User.findById(user.id);
     const a = {
        dateOfBirth :  dateOfBirth,
        about :  about,
        contactNumber :  contactNumber,
        gender :gender
      
       }
       console.log("user",user)
     const profileDetails = await Profile.findByIdAndUpdate(userDetails.profile,a,{new:true}) 
console.log(profileDetails)
    return res.status(200).json({
        success:true,
        message:"profile updated",
        profileDetails : profileDetails
    })
}
catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message : 'error occured',
    });
}



    
}