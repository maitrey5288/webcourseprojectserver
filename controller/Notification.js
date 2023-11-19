const Notification  = require('../models/Notification')


exports.getAllNotification = async(req,res) => {
    try {
        const user = req.user
        const noti = await Notification.find({user:user.id});
        
          return res.status(200).json({
            success:true,
            message : "categories fetched successfully",
            catagories : noti,
           
          })


    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}

