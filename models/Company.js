const mongoose = require("mongoose");
const User = require("../models/User");


const Schema = mongoose.Schema;

const CompanySchema = new Schema({
 
 
    ChefEmail:[ {
    type: String,
  }],

  nameCompany: {
    type: String,
  },
  
  
  
  WorkersEmail: [{ 
    
    type: String,
    
   
  }],

  




});
module.exports = mongoose.model("Company", CompanySchema);
