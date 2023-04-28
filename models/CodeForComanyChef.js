const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");
const ApplicationsForm = require("../models/ApplicationsForm");
const Works = require("../models/Works");




const Schema = mongoose.Schema;

const CodeForCompanyChefSchema = new Schema({
 
 
    code: {
    type: String,
  },
  
  
  

  Company : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company", 

    },


  User : {

    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  





  




});
module.exports = mongoose.model("CodeForCompanyChef", CodeForCompanyChefSchema);
