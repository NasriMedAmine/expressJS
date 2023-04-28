const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");
const ApplicationsForm = require("../models/ApplicationsForm");
const Works = require("../models/Works");




const Schema = mongoose.Schema;

const ConfirmationWorksSchema = new Schema({
 
 
    code: {
    type: String,
  },
  
  
  
  atThisDate: { 
    
    type: Date,
    
   
  },

  Company : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",  },

  Work : {

    type: mongoose.Schema.Types.ObjectId,
    ref: "works",
  },

  User : {

    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  





  




});
module.exports = mongoose.model("ConfirmationWorks", ConfirmationWorksSchema);
