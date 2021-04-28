const Validator = require('validator'),
    isEmpty = require('./isEmpty')
    _ = require('lodash')

let validateCreateDisease = function validateCreateDiseaseParams(data){
    let errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : "";
    data.symptoms = !isEmpty(data.symptoms) ? data.symptoms : "";
 
    if(Validator.isEmpty(data.name)){
        errors.name = "name is required"
    }

    if(!_.isArray(data.symptoms)){
        errors.symptoms = "symptoms should be an array."
    }else if(data.symptoms.length<1){
        errors.symptoms = "at least one symptoms is required."
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
let validateUpdateDisease = function validateUpdateDiseaseParams(data){
    let errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : "";
    data.symptoms = !isEmpty(data.symptoms) ? data.symptoms : "";
 
    if(Validator.isEmpty(data.name)){
        errors.name = "name is required"
    }

    if(!_.isArray(data.symptoms)){
        errors.symptoms = "symptoms should be an array."
    }else if(data.symptoms.length<1){
        errors.symptoms = "at least one symptoms is required."
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
module.exports = {
    validateCreateDisease,
    validateUpdateDisease
}