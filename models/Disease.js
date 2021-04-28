const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DiseaseSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  symptoms: [{
    type: String,
    required: true
  }],

  description:{
    type: String,
    required: false,
    default: null
  },

  is_archived:{
      type: Boolean,
      default: false
  },

  created_at:{
      type: Date,
      default: Date.now
  },

  updated_at:{
    type: Date,
    default: Date.now
 }

});

module.exports = Disease = mongoose.model("disease", DiseaseSchema);
