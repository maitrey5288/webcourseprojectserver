const Project = require("../models/Project")
const cloudinary = require('cloudinary').v2
const User = require("../models/user")
const Profile = require("../models/Profile")
const Category = require('../models/Category')
const nodemailer = require('nodemailer')
const { findById } = require("../models/InvestmentOP")
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
exports.createProject = async (req,res) => {

    try {
        
        //fetch details
        const {name,description,type,categoryName} = req.body ;
        const teamMembers = JSON.parse(req.body.teamMembers)
        // TODO : verify details 
        const categoryDetails = await Category.findOne({name:categoryName})
        // console.log(categoryDetails,ca)
        console.log(categoryDetails,categoryDetails._id,categoryName)
        const category = await categoryDetails._id

        //upload thumbnail
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
        console.log(response)
console.log("team",teamMembers)
        const users = await User.find({ 'email': { $in: teamMembers } });
        console.log('users',users)
        const arr =  users.map(user => user._id);
        //create project
        console.log(arr,"array")
        const project = await Project.create({
            name :  name,
            type :  type,
            description :  description,
            thumbnail : response.secure_url,
            teamMembers : arr,
            category : category

        })

        const profiles  = users.map(user => user.profile)

        for(let i=0;i<profiles.length;i++){
            const profileDetils =await Profile.updateOne({_id : profiles[i]},{ $push: { projects: project._id}})
        }

        console.log(project,"project")
        return res.status(200).json({
            success :true,
            message : "project created successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }



}

exports.checkEmails = async (req,res) => {
   try {
    const {email}  = (req.body);
    
   
   
        const b = await User.findOne({email:email})
        console.log(b)
        if(!b){
            return res.status(501).json({
                success : false,
                message  : "user is not registered"
            })
        }
    
     

    return res.status(200).json({
        success:true,
    })
   } catch (error) {
    console.log(error)
    return res.status(500).json({
        success :false,
        message : error.message,
    })
   }
}




exports.getProjectDetails  = async (req,res) => {
    try {
        console.log("here")
        const user = req.user
        console.log("user",user)
        const userDetails= await User.findById(user.id)
        const profile = await Profile.findById(userDetails.profile).populate({path : "projects",populate: {
            path: 'category',
            
          },
          populate:{
            path : 'teamMembers',select: { '_id': 1,'firstName':1},
          },
          }).exec()



          


        return res.status(200).json({
             success:true,
             projects : profile.projects
        })
        
    } catch (error) {
     console.log(error)
     return res.status(500).json({
         success :false,
         message : error.message,
     })
    }
 }


 exports.deleteProject = async(req,res) => {
    try {

        const user = req.user
        const projectId = req.body.projectId;


        const ProjectDetails = await Project.findById(projectId)

        if(!ProjectDetails){
            return res.status(400).json({
                success : false,
                message : "Project id is invalid"
            })
        }
console.log("hi",ProjectDetails,"project")
        if(!ProjectDetails.teamMembers.includes(user.id))
        {
            console.log("he")
            return res.status(400).json({
                success:false,
                message : "You are not part of this project"
            })
        }

        const deleteProject = await Project.findByIdAndDelete(projectId);
        const users = await User.find({ '_id': { $in: ProjectDetails.teamMembers } });
        const profiles  = users.map(user => user.profile)

        console.log("profile",profiles)
        for(let i=0;i<profiles.length;i++){
            console.log("")
            const profileDetils =await Profile.updateOne({_id : profiles[i]},{ $pull: { projects: ProjectDetails._id}})

        }
        console.log("li",deleteProject,"delete")
        return res.status(200).json({
            success : true,
            message : 'project deleted successfully',
            
        })





    } catch (error) {
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }
 }

exports.getProjectDetailsByID = async(req,res) => {
    try {
       
        const user = req.user;
        const projectId = req.body.projectId;
        console.log("1")
    
        if(!projectId){
            return res.status(400).json({
                success: false,
                message : "project id is required"
            })
        }
        const ProjectDetails = await Project.findById(projectId);
        console.log("2")
        if(!ProjectDetails){
            return res.status(400).json({
                success :false,
                message : "project id is invalid"
            })
        }
        const userDetails = await User.findById(user.id).populate({path:"profile"}).exec();
        console.log("3",userDetails)
        if(userDetails.profile.projects.includes(projectId)){
            return res.status(200).json(
                {
                    success :true,
                    project : ProjectDetails
                }
            )
        }
        
        return res.status(400).json({
            success : false,
            message : 'you are not part of this project'
        })
        


    } catch (error) {
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }
}


exports.updateProject = async(req,res) => {
    try {
        
        const {name,description,type,projectId} = req.body ;
        console.log(req.body,"body")
      
        const user = req.user
       
        const a = {
            name :  name,
            type :  type,
            description :  description,
          
           }
        if(req.files)
        {
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
        a.thumbnail = response.secure_url
        }
        console.log(projectId,"porjectid")
        const project = await Project.findByIdAndUpdate(projectId,a,{new:true}) 
        return res.status(200).json({
            success:true,
            message : 'project edited successfully',
            projectis:project
        })

    } catch (error) {
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }
}




exports.getAllProjects = async(req,res) => {
    try {
        const projectlist =  await Project.find().populate({path:'category'}).populate({path:'teamMembers',select:{_id:1,firstName:1,lastName:1,email:1}})

        return res.status(200).json({
            success:true,
            message : 'projects fetched successfully',
            projectList:projectlist
        })

    } catch (error) {
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }
}

exports.likeProject = async(req,res) => {
    try {
        console.log("likd")
        const user = req.user
        const {projectId} = req.body
        const userDetails = await User.findById(user.id)
        const profileDetails = await Profile.findByIdAndUpdate(userDetails.profile,{ $push: { likedProjects: projectId}})
        const ProjectDetails = await Project.findByIdAndUpdate(projectId,{$inc: { likesCount: 1 } })

        return res.status(200).json({
            success:true,
            message : 'projects liked successfully',
         
        })



    } catch (error) {
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }
}

exports.unlikeProject =  async(req,res) => {
    try {
        
        const user = req.user
        const {projectId} = req.body
        const userDetails = await User.findById(user.id)
        const profileDetails = await Profile.findByIdAndUpdate(userDetails.profile,{ $pull: { likedProjects: projectId}})
        const ProjectDetails = await Project.findByIdAndUpdate(projectId,{$inc: { likesCount: -1 } })
       
        return res.status(200).json({
            success:true,
            message : 'projects unliked successfully',
         
        })




    } catch (error) {
        return res.status(500).json({
            success :false,
            message : error.message,
        })
    }
}


exports.getLikedProjects = async(req,res) => {
    try {
        
        const user = req.user

        const userDetails = await User.findById(user.id);
        const profileDetails = await Profile.findById(userDetails.profile)

        return res.status(200).json({
            success:true,
            message : 'projects unliked successfully',
            projectList : profileDetails.likedProjects
        })


    } catch (error) {
        
    }
}
exports.contactTeamMembers = async(req,res) => {
    try {
        
        const user = req.user

        const userDetails = await User.findById(user.id);
        const profileDetails = await Profile.findById(userDetails.profile)

        const {teamMembers} = req.body
        console.log("here",teamMembers,req.body)
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
        for (const member of teamMembers) {
           
            console.log("hi",member)
            let info = await transporter.sendMail ({
                from: `Sparktank`,
                to: member,
                subject: "A user wants to contact you",
                html: ` <h1>Hello</h1>
                <h3>${userDetails.firstName} ${userDetails.lastName} is interested in your project. He wants to contact you.Please communicate with him if you are interested.Email is mentioned below</h3>
                <h4>details of the user :-</h4>
                <h5>name - ${userDetails.firstName} ${userDetails.lastName}</h5>
                <h5>email - ${userDetails.email} </h5>
                <h5>Contact Number - ${profileDetails.contactNumber}</h5>
                <h5>About - ${profileDetails.about}</h5>
        `
            })
            console.log("hello")
        };

        return res.status(200).json({
            success:true,
            message : 'email sent to team members',
         
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'error occured', 
        });
    }
}
exports.contactInvestor = async(req,res) => {
    try {
        
        const user = req.user

        const userDetails = await User.findById(user.id);
        const profileDetails = await Profile.findById(userDetails.profile)

        const {investor} = req.body
      
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
       
           
            console.log("hi",investor)
            let info = await transporter.sendMail ({
                from: `Sparktank`,
                to: investor,
                subject: "A user is Contacting",
                html: ` <h1>Hello Investor</h1>
                <h3>${userDetails.firstName} ${userDetails.lastName} is interested in your Investment. He wants to contact you.Please communicate with him if you are interested.Email is mentioned below</h3>
                <h4>details of the user :-</h4>
                <h5>name - ${userDetails.firstName} ${userDetails.lastName}</h5>
                <h5>email - ${userDetails.email} </h5>
                <h5>Contact Number - ${profileDetails.contactNumber}</h5>
                <h5>About - ${profileDetails.about}</h5>
        `
            })
            console.log("hello")
       

        return res.status(200).json({
            success:true,
            message : 'email sent to investor',
         
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'error occured', 
        });
    }
}
 