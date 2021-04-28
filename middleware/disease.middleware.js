const { validateCreateDisease, validateUpdateDisease } = require('../validation/disease');


/******************************** Validate Create Disease params ***************************/
let createDiseaseValidation = (req,res,next)=>{
    const { errors , isValid} = validateCreateDisease(req.body);
    if(!isValid){
        // Aws.deleteImage(req.imageUrl);
        return res.status(400).json({
            msg:errors
        })
    }else{
       next();
    }
}
/******************************** Validate Update Disease params ***************************/
let updateDiseaseValidation = (req,res,next)=>{
    const { errors , isValid} = validateUpdateDisease(req.body);
    if(!isValid){
        // Aws.deleteImage(req.imageUrl);
        return res.status(400).json({
            msg:errors
        })
    }else{
       next();
    }
}

module.exports = {
    createDiseaseValidation,
    updateDiseaseValidation
}
