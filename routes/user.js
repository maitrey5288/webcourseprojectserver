const express = require('express');
const  router = express.Router();

const {login,signup,getUserData,confirmMail} =require('../controller/Auth')
const {auth,isProjectOwner,isInvestor,isAdmin}  = require('../middlewares/auth')
const {createProject} =require('../controller/Project')
const {getAllCategories} = require('../controller/Category')
const {checkEmails} = require('../controller/Project')
const {getProjectDetails,deleteProject,getProjectDetailsByID,updateProject,getAllProjects,likeProject,unlikeProject,getLikedProjects}  =require('../controller/Project')
const {createInvestmentOp,getInvestmentOps,getInvestmentById,deleteInvestment,getAllInvestments} = require('../controller/Investment')
const {getAllNotification} = require ('../controller/Notification')

router.post('/getUserData',auth,getUserData)
router.post('/login',login);
router.post('/signup',signup);
router.post('/createproject',createProject);
router.get('/getallCategories',getAllCategories);
router.post('/checkEmails',checkEmails)
router.post('/getProjectDetails',auth,getProjectDetails)
router.post('/deleteProject',auth,deleteProject) 
router.post('/getProjectDetailsByID',auth,getProjectDetailsByID)  
router.post('/editProject',updateProject)
router.post('/confirmMail',confirmMail)
router.post('/getInvestmentOpList',auth,isInvestor,getInvestmentOps)
router.post('/createInvestmentOp',auth,isInvestor,createInvestmentOp)
router.post('/getInvestmentById',auth,getInvestmentById)
router.post('/deleteInvestment',auth,deleteInvestment)
router.post('/getNoti',auth,getAllNotification)
router.post('/likeProject',auth,likeProject)
router.post('/unlikeProject',auth,unlikeProject)
router.post('/getLikedProjects',auth,getLikedProjects)
router.get('/getAllProjects',getAllProjects)
router.get('/getAllInvestments',getAllInvestments)
 

router.get('/test',auth,(req,res)=>{

    res.json({
        success:true,
        message : 'welcome to the protected route for tests',
        
    })
})


router.get('/student',auth,isProjectOwner, (req,res)=> {
    res.json({
        success :true,
        message : 'welcome to the protected route for students'
    })
})
router.get('/admin',auth,isAdmin, (req,res)=> {
    res.json({
        success :true,
        message : 'welcome to the protected route for admin'
    })
})

module.exports = router;
