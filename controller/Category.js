const category  = require('../models/Category')


exports.getAllCategories = async(req,res) => {
    try {
        
        const catagories = await category.find();
        const catagoriesList =   catagories.map((obj)=>
          {
            console.log(obj)
            
            const a = {
                name : obj.name,
                description : obj.description
            }
            return a

        
        });
          return res.status(200).json({
            success:true,
            message : "categories fetched successfully",
            catagories : catagoriesList,
           
          })


    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}