const Investment = require('../models/InvestmentOP')
const Category = require('../models/Category')
const User = require('../models/user')
 const Profile = require('../models/Profile')
 const cloudinary = require('cloudinary').v2
 function isFileTypeSupported(type,supportedTypes) {
     return supportedTypes.includes(type);
 }
 
 async function uploadToCloudinary(file,folder,quality){
     const options = {folder}
     
     if(quality){
         options.quality = quality;
     }
 
     options.resource_type = 'auto'
 
    return await cloudinary.uploader.upload(file.tempFilePath ,options)
 
 
 }
exports.createInvestmentOp = async(req,res) => {
    try {
        const user = req.user
        const {title,about,categoryName,deadline,files} = req.body;
        console.log("here1")

        const file = req.files.thumbnail;
        console.log(file);

        const supportedTypes  = ['jpg','png','jpeg']
        const fileType = file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType,supportedTypes)){

            return res.status(400).json({
                success:false,
                message :"file format not supported",
            })
        }


        const response = await uploadToCloudinary(file ,'web_cp');

        const categoryDetails = await Category.findOne({name:categoryName})
        console.log(categoryDetails,categoryDetails._id,categoryName)
        const category = await categoryDetails._id
        console.log("cid",category)
        const createIn = await Investment.create({
            title,about,category:categoryDetails._id,user:user.id,deadline,   thumbnail : response.secure_url,
        });
        console.log("here2") 
        const userDet = await User.findById(user.id)
        console.log(userDet,"details")
        const profileadd = await Profile.findByIdAndUpdate(userDet.profile,{ $push: { investmentOP: createIn._id}})



        return res.status(200).json({
            success : true,
            message : "Investment opp created successfully"
        })






    } catch (error) {
        return res.status(500).json({
            success:false,
            message : error.message,
        })
    }
}


exports.getInvestmentOps = async (req,res) => {
    try {
        console.log("hi")
        const user = req.user
        const userinfo = await User.findById(user.id).populate({ 
            path: 'profile',
            populate: {
              path: 'investmentOP',
              
            } 
         })



        
        return res.status(200).json({
            success : true,
            message : "Investment list",
            list : userinfo.profile.investmentOP,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message : error.message,
        })
    }
}


exports.getInvestmentById = async(req,res) => {
    try {
        
        const user = req.user;
        const id = req.body.id;
        
        
        const investmentDetails  = await Investment.findById(id).populate({path:'category'}).exec();
        console.log(investmentDetails)
        return res.status(200).json({
            success : true,
            message : "details fetched successfully",
            investment : investmentDetails
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message : error.message,
        })
    }
}

exports.deleteInvestment = async(req,res) => {
    try {

        const user = req.user
        const investmentId = req.body.investmentId;

console.log(investmentId,"i")
        const InvestmentDetails = await Investment.findById(investmentId)
        console.log(InvestmentDetails)

        if(!InvestmentDetails){
            return res.status(400).json({
                success : false,
                message : "Investment id is invalid"
            })
        }
console.log("hi",InvestmentDetails.user,"project",user.id)

        // if(!InvestmentDetails.user != user.id)
        // {
        //     console.log("he")
        //     return res.status(400).json({
        //         success:false,
        //         message : "You are not part of this Investment"
        //     })
        // }

        const deleteInvestment = await Investment.findByIdAndDelete(investmentId);
        const users = await User.findById({ '_id': InvestmentDetails.user });
        const profile  = user.profile

        // console.log("profile",profiles)
        
            const profileDetails =await Profile.updateOne({_id : profile},{ $pull: { investmentOP: InvestmentDetails._id}})

       
        // console.log("li",deleteProject,"delete")
        return res.status(200).json({
            success : true,
            message : 'Investment deleted successfully',
            
        })





    } catch (error) {
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }
 }


 exports.getAllInvestments = async(req,res) => {
try {
    const InvestmentDetails  = await Investment.find().populate({path:'category'})

    return res.status(200).json({
        success : true,
        message : 'Investment deleted successfully',
        InvestmentList : InvestmentDetails
    })

} catch (error) {
    
}

 }