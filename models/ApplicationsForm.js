const { number } = require("joi");
const mongoose = require("mongoose");

const ApplicationsFormSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: false,
      },
      LastName:{
        type: String,
        required: false,
    },
    
    Email:{
    
        type: String,
        required: false,
      },
    
      Cv: {
        type:String,
       required : false,
      },
      MotivationLetter: {
        type:String,
       required : false,
      },
      AcceptApplication: {
        type: Boolean,
        default: false,
      },
      works: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "works",
        required: false
      },
      worksTitle : {
        type:String,
       required : false,
      },
      jobOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false
      },
     
     
     
     
    
});

module.exports = mongoose.model("ApplicationsForm", ApplicationsFormSchema);