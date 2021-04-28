const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const natural = require("natural");
const SpellCorrector = require("spelling-corrector");
const classifier = require("../../naive_bayes/NaiveBayes");
// const SW = require("stopword");

// Load input validation
const {
    createDiseaseValidation,
    updateDiseaseValidation
  } = require("../../middleware/disease.middleware");
  
  // Load User model
  const Disease = require("../../models/Disease");
  const DiseaseHelper = require("../../controller_helper/disease.helper")
  
  router.get('/',
  auth,
  async(req,res)=>{
      
      let data = await Disease.find({
          is_archived: false
      })
      return res.status(200).json({
          msg: 'Success',
          data: data
      })
  })
  
  
  
  router.post("/",
    auth,
    createDiseaseValidation,
  DiseaseHelper.diseaseAlreadyExist,
  async(req,res)=>{
      try {

        let { name , symptoms , description } = req.body;
        symptoms = symptoms.map(data=>{
             return data.toLowerCase()
         })

        let disease = await Disease.create({
            name:name.toLowerCase(),
            symptoms,
            description
        });

        return res.status(201).json({
            message: 'Success',
            data: disease
        })
      } catch (error) {
          console.log(error);
          return res.status(400).json({
            msg: error.message
          })
      }
  })  

  router.patch("/:id",
    auth,
    updateDiseaseValidation,
    DiseaseHelper.diseaseExist,
    DiseaseHelper.validForUpdate,
  async(req,res)=>{
      try {
        let id = req.params.id;
        let { name , symptoms , description } = req.body;
        symptoms = symptoms.map(data=>{
             return data.toLowerCase()
         })

        let disease = await Disease.findByIdAndUpdate(id,{
            name: name.toLowerCase(),
            symptoms,
            description
        },{new: true})

        return res.status(200).json({
            message: 'Success',
            data: disease
        })
      } catch (error) {
          console.log(error);
          return res.status(400).json({
            msg: error.message
          })
      }
  })

  router.delete("/:id",auth,DiseaseHelper.diseaseExist, async(req,res)=>{
    try {
      let id = req.params.id;
   

      let disease = await Disease.findByIdAndUpdate(id,{
        is_archived: true
      },{new: true})

      return res.status(200).json({
          message: 'Success',
          data: disease
      })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
          msg: error.message
        })
    }
})



router.post("/predict",async(req,res)=>{
  try {
    if(!req.body.data){
      return res.status(400).json({
        msg: "Prediction data is required."
      })
    }else{
      // 
      let data = req.body.data;
      // changing to lower case;
      let casedText=data.toLowerCase();
      // removing special characters from string;
      let alphaOnlyText = casedText.replace(/[^a-zA-Z\s]+/g, "");
      const {WordTokenizer} = natural;
      const tokenizer = new WordTokenizer();

      const tokenizedWords = tokenizer.tokenize(alphaOnlyText);

      // load dictionary obj
      // const spellCorrector = new SpellCorrector();
      // spellCorrector.loadDictionary();

      // tokenizedWords.forEach((word, index) => {
      //   tokenizedWords[index] = spellCorrector.correct(word);
      // });
      
      
      let text = tokenizedWords.slice(0, tokenizedWords.length).join(' '); // filtered
      //get all data to train
      let Diseases = await Disease.find({
        is_archived : false
      });
      
      if(Diseases.length<1){
        return res.status(400).json({
          msg: "No class to train."
        })
      }

      Diseases.forEach(disease=>{
        disease.symptoms.forEach(symptom=>{
          classifier.classify(symptom,disease.name)
        })
      });
    var i;
    var j;
    for(i = 0 ; i< Diseases.length; i++){
      for(j = 0 ; j<Diseases[i].symptoms.length ; j++){
        classifier.classify(Diseases[i].symptoms[j].toLowerCase(),Diseases[i].name.toLowerCase());
      }
    } 
    if(i== Diseases.length){
      console.log('Text',text);
     let response = classifier.categorize(text);
     console.log(response);
     let x;
     let diseaseObj;
     let returnData = [];
     
      for( x = 0 ; x < response.length ; x++){
        // diseaseObj;

        diseaseObj = await Disease.aggregate([
          {$match: {
            name: response[x].disease
          }},
          {
            $project: {
              __v:0,is_archived:0,created_at:0,updated_at:0
            }
          },
          {
            $addFields:{
              probability: response[x].probability
            }
          }
      ]);
      returnData.push(diseaseObj[0]);
      }

      // console.log('returnData',returnData)


      returnData = returnData.sort((a,b)=>parseInt(b.probability)-parseInt(a.probability));
      if(returnData[0].probability==0){
        return res.status(400).json({
          msg: 'Data does not match with knowledge base.'
        })
      }

      
      returnData = returnData.slice(0,4);


      returnData = returnData.filter(data=>{
       return data.probability != 0; 
      })

     return res.status(200).json({
        returnData
     })
    }
  }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
          msg: error.message
        })
    }
});

module.exports = router;
