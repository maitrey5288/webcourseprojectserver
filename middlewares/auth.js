//auth isStud , isAdmin

const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.auth = (req,res,next) => {
    try {
        //extract jwt token
        
        //pending : other ways to fetch token
        const token = req.body.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:'token missing',
            })
        }

        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            
            req.user = decode;
console.log(req.user)
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success :false,
            message: 'something went wrong, while verifying the token',
        })
    }
}

exports.isProjectOwner = (req,res,next) => {
    try {
        if(req.user.role !== 'Projectowner'){
            return res.status(401).json({
                success :false,
                message : "this is protected route for projectowner"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'user role is not matching'
        })
    }
}
exports.isInvestor = (req,res,next) => {
    try {
        if(req.user.role !== 'investor' && req.user.role !== 'Investor'){
            return res.status(401).json({
                success :false,
                message : "this is protected route for Investor"
            });
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false, 
            message:'user role is not matching'
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try {
        console.log("hihere")
        if(req.user.role !== 'Admin'){
            console.log('in')
            return res.status(401).json({
                success :false,
                message : "this is protected route for admin"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'user role is not matching'
        })
    }
}

