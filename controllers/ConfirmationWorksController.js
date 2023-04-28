const ApplicationsForm = require("../models/ApplicationsForm");
const Company = require("../models/Company")
const Works = require("../models/Works");
const User = require("../models/User");
const ConfirmationWorks = require("../models/ConfirmationWorks");
const SendEmailConfirmation = require("../controllers/SendEmailConfirmation");
const CodeForComanyChef = require("../models/CodeForComanyChef")
const CodeForEmp = require("../models/CodeForEmp")



const mongoose = require("mongoose");




exports.ConfirmationJob = (req,res) => {


    console.log("test ConfirmationJob");
    console.log(req.body);
  Company.findOne({"ChefEmail" : req.body.emailChef})
  .then(companyFound =>{


    
    Works.findOne({ "positionname": req.body.nameWork })
    .then(workFound => {

        User.findOne({ "email": req.body.emailUser })
        .then(userFound => {
            
          let codeInt = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
          

            let confirmationWorks = new ConfirmationWorks({
                code : codeInt.toString(),
                atThisDate : req.body.atThisDate,
                Work : workFound,
                Company : companyFound,
                User : userFound

            })

            SendEmailConfirmation(userFound.email,
              "Invitation to Interview for Job Application at"+ companyFound.nameCompany +",",
              "Dear   "+ userFound.lastName +",<br><br>"+
              "I hope this email finds you well. I wanted to take a moment to thank you for applying for our job opening at <a href='#'>"+  companyFound.nameCompany+"</a>. I'm pleased to inform you that your application has been accepted and we'd love to invite you for an interview. <br><br>"+
              "Here is the code that you'll need to join the interview:  <a href='#'> "+ codeInt.toString() +" </a><br><br>"
              )

            
            confirmationWorks.save()
            .then(() => {
                res.status(200).json({
                    "confirmationWorks": confirmationWorks,
                    "message" : "confirmationWorks add in BD succes",
                    "operation" : "confirmationWorksSaved"
                  });
            })
            .catch(err => {

                return res.status(200).json({
                  "error": err,
                  "message" : "confirmationWorks add in BD Failed",
                  "operation" : "CatchconfirmationWorksSaved"

                });
            
              })


            
            

        })
        .catch(err3 => {

            return res.status(200).json({
              "error": err3,
              "message" : "User not found",
              "operation" : "confirmationWorksSaved"

            });
        
          })
      

    })
    .catch(err2 => {

      return res.status(200).json({
        "error": err2,
        "message" : "Works not found"
      });
  
    })



  })
  .catch(err => {

    return res.status(200).json({
      "error": err,
      "message" : "company not found"
    });

  })


}
  


exports.VerifieCode = (req,res) => {
  console.log(req.body)
  console.log("----------------1")




  CodeForComanyChef.findOne({"code" : req.body.code})
  .then(codeForComanyChefFound =>{

    

    if(codeForComanyChefFound !=null && codeForComanyChefFound != undefined)
    {






      User.findById(codeForComanyChefFound.User)
            .then(userFound =>{
      
              if(userFound !=null && userFound != undefined)
              {

                Company.findOne({"ChefEmail" : userFound.email})
                .then(companyFound => {

                  return res.status(200).json({
                    "message" : "confirmationWorksFound",
                    "confirmation" : CodeForComanyChef,
                    "role" : "chef",
                    "company" : companyFound,
                    "user" : userFound
                  });


                })
                .catch(err => {

                  return res.status(200).json({
                    "error": err,
                    "message" : "company not found",
                    "role" : "err",

                  });
              
                })

                
              }
              else{
                return res.status(200).json({
                  "error": "err",
                  "message" : "userFound not Found",
                  "role" : "err",

                });

              }
      
      
      
              
            })
            .catch(err => {
      
              return res.status(200).json({
                "error": err,
                "message" : "userFound not Found catch",
                "role" : "err",

              });
          
            })




      
    }
    else{


      ConfirmationWorks.findOne({"code" : req.body.code})
      .then(confirmationWorksFound => {
        
    
        if(confirmationWorksFound !=null && confirmationWorksFound != undefined)
        {

          
          Works.findById(confirmationWorksFound.Work)
          .then(workFound => {
      

            if(workFound !=null && workFound != undefined)
            {

            User.findById(confirmationWorksFound.User)
            .then(userFound =>{
      
              if(userFound !=null && userFound != undefined)
              {

                return res.status(200).json({
                  "message" : "confirmationWorksFound",
                  "confirmation" : confirmationWorksFound,
                  "work" : workFound,
                  "user" : userFound,
                  "role" : "PresEmployer",
                  

                });


            

                
              }
              else{
                return res.status(200).json({
                  "error": "err",
                  "message" : "userFound not Found",
                  "role" : "err",

                });

              }
      
      
      
              
            })
            .catch(err => {
      
              return res.status(200).json({
                "error": err,
                "message" : "userFound not Found",
                "role" : "err",

              });
          
            })


              
            }
            else{

              return res.status(200).json({
                "error": "err",
                "message" : "workFound not Found",
                "role" : "err",

              });

            }

      
          })
          .catch(err => {
      
            return res.status(200).json({
              "error": err,
              "message" : "workFound not Found",
              "role" : "err",

            });
        
          })

        }
        else
        {



          CodeForEmp.findOne({"code" : req.body.code})
          .then(codeForEmpFound => {
            

            if(codeForEmpFound !=null && codeForEmpFound != undefined)
            {


              User.findById(codeForEmpFound.User)
              .then(userFound2 => {

                if(userFound2 !=null && userFound2 != undefined)
                {


                  Company.findById(codeForEmpFound.Company)
                  .then(companyFound2 => {
                    if(companyFound2 !=null && companyFound2 != undefined)
                    {


                      return res.status(200).json({
                        "message" : "confirmationWorksFound",
                        "confirmation" : codeForEmpFound,
                        "company" : companyFound2,
                        "user" : userFound2,
                        "role" : "Employer",
                        
      
                      });

                    }
                    else{
                      return res.status(200).json({
                        "error": "err",
                        "message" : "companyFound ",
                        "role" : "err",

                      });


                    }

                  })
                  .catch(err => {
    
                    return res.status(200).json({
                      "error": "err",
                      "message" : "companyFound Catch"
                    });
                
                  })


                }
                else{

                  return res.status(200).json({
                    "error": "err",
                    "message" : "userFound ",
                    "role" : "err",

                  });
                }

              })
              .catch(err => {
    
                return res.status(200).json({
                  "error": "err",
                  "message" : "userFound Catch",
                  "role" : "err",

                });
            
              })



            }
            else{

              return res.status(200).json({
                "error": "err",
                "message" : "codeForEmpFound not found",
                "role" : "err",

              });

            }
          })
          .catch(err => {
    
            return res.status(200).json({
              "error": "err",
              "message" : "codeForEmpFound Catch",
              "role" : "err",

            });
        
          })


        }

    
      })
      .catch(err => {
    
        return res.status(200).json({
          "error": "err",
          "message" : "confirmationWorksNotFound catch",
          "role" : "err",

        });
    
      })
    
    



    }

  })
 .catch(err => {

    return res.status(200).json({
      "error": err,
      "message" : "CodeForComanyChef notFound catch",
      "role" : "err",

    });

  })




  





}