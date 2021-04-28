const Disease = require("../models/Disease");


let diseaseAlreadyExist = async (req,res,next)=>{
    try {
        let disease = await Disease.findOne({name: req.body.name})
        if(!disease){
            next();
        }else{
            return res.status(400).json({
                msg:"Disease already exists."
            })
        }
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}
let diseaseExist = async (req,res,next)=>{
    try {
        let disease = await Disease.findOne({_id: req.params.id})
        if(disease){
            next();
        }else{
            return res.status(400).json({
                msg:"Disease does not exists."
            })
        }
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}
let validForUpdate = async (req,res,next)=>{
    try {
        let disease = await Disease.findOne(
        {
            name: req.body.name,
            _id: { 
                $ne: req.params.id
            }
        }
        )
        if(!disease){
            next();
        }else{
            return res.status(400).json({
                msg:"Disease already exists."
            })
        }
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

module.exports = {
    diseaseAlreadyExist,
    validForUpdate,
    diseaseExist
}