//Create a classifier object

_ = require('lodash');

var Classifier = function() {
    this.dictionaries = {};
 };
 
 //Classify is used to "teach" something to your machine
 //You pass it a string and a group to which it's associated with
 Classifier.prototype.classify = function(text, group) {
     //Code will go here.
     var words = text.split(" ");
     this.dictionaries[group] ? "" : this.dictionaries[group] = {};
     var self = this;
     words.map((w) => {
        // self.dictionaries[group][w] = 1;

         self.dictionaries[group][w] ? self.dictionaries[group][w]++ : self.dictionaries[group][w] = 1;
     });
    //  console.log('words',words)
 };
 
 
 //Categorize will check a string against the dictionaries to see
 //in which group it falls.
 Classifier.prototype.categorize = function(text) {
     //Code will go here.
     var words = text.split(" ");
    //  console.log('words',words)
     var self = this;
     var probabilities = {};
     var groups = [];
     var finals = {};
//   console.log('this.dictionaries',this.dictionaries)
     //Find the groups
     for (var k in this.dictionaries) {groups.push(k);}
    //  console.log('groups',groups)
    
     for (var i = 0; i < words.length; i++) {
         //Ignore small words
         console.log(i,'_______',words[i])
         words[i] = words[i].toLowerCase();
         console.log(i,'_______',words[i])

         if (words[i].length <= 2) continue;
         //find the word in each group
         var sums = {}; // number of times the word in sentence is in the class/group.
         var probs = {}; // kun group ma kati choti occur vayo.
         for (var j = 0; j < groups.length; j++) {
             if (!sums[words[i]]){
                sums[words[i]] = 0;
             
            }
             if (!this.dictionaries[groups[j]][words[i]]){

                this.dictionaries[groups[j]][words[i]] = 0;


                // console.log(i,'____this.dictionaries ',this.dictionaries)

             } 
             sums[words[i]] += this.dictionaries[groups[j]][words[i]];
             probs[groups[j]] = (this.dictionaries[groups[j]][words[i]]) ? this.dictionaries[groups[j]][words[i]] : 0;
         }
        //  console.log('sums',sums)
        //  console.log('probs',probs)

         // Calculate the actual probability that a word is part of a group or another
         for (var j = 0; j < groups.length; j++) {
            // console.log(j,probs[groups[j]],'____',words[i],'==>',(probabilities[words[i]]));

             (!probabilities[words[i]]) ? probabilities[words[i]] = {} : "";

             (!probs[groups[j]]) ? probabilities[words[i]][groups[j]] = 0 : probabilities[words[i]][groups[j]] = probs[groups[j]]/sums[words[i]];
         }
        //  console.log('_____probabilities',probabilities)
        
         //Average out the probabilities
         for (var j = 0; j < groups.length; j++) {
             if (!finals[groups[j]]) finals[groups[j]] = [];
             finals[groups[j]].push(probabilities[words[i]][groups[j]]);
         }
        //  console.log('__final__',finals)
     }
  
     for (var i = 0; i < groups.length; i++) {
         finals[groups[i]] = average(finals[groups[i]]);
     }
    //  console.log('__final__',finals)
  
     //Find the highest probability
     var highestGroup = "";
     var highestValue = 0;
     for (var group in finals) {
         if (finals[group] > highestValue) {
             highestGroup = group;
             highestValue = finals[group];
         }
     }
    //  console.log('____',highestValue);

    let response = [];
    let object = {};


     for (let d in finals){
         object = {};

         finals[d]= finals[d]*100;
        //  console.log('finals',d);
         object = {
             disease: d,
             probability: finals[d]
         };
         response.push(object);

     }


     return response;
  };

  //Just an average function
function average(numbers) {
    var sum = 0;
    for (var i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum / numbers.length;
 }
// let diabetes = ["polyuria","polydypsia","shortness of breath","pain chest","asthenia","nausea","orthopnea","rale","sweat","sweating increased","unresponsiveness","mental status changes","vertigo","vomiting","labored breathing"];
// let depression = ["feeling suicidal","suicidal","hallucinations auditory","feeling hopeless","weepiness","sleeplessness","motor retardation","irritable mood","blackout","mood depressed","hallucinations visual","worry","agitation","tremor","intoxication","verbal auditory hallucinations","energy increased","difficulty","nightmare","unable to concentrate","homelessness"]
//  var classifier = new Classifier();
// // classifier.classify("polyuria,polydypsia,shortness of breath,pain chest,asthenia,nausea,orthopnea,rale,sweat,sweating increased,unresponsiveness,mental status changes,vertigo,vomiting,labored breathing", "diabetes");
// // classifier.classify("Celui ci est also aussi en francais", "fr");
// // classifier.classify("This text is in english", "en");
// // classifier.classify("This text is also in english", "en");
// diabetes.forEach(symptoms=>{
//     classifier.classify(symptoms,'diabetes')
// })
// depression.forEach(symptoms=>{
//     classifier.classify(symptoms,'depression')
// })
// console.log(classifier.categorize("text in english"));
// console.log(classifier.categorize("I am having leg pain. heartache, headache"));

module.exports = new Classifier;