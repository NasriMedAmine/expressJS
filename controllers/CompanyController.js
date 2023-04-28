const User = require("../models/User");
const Company = require("../models/Company")
const SendEmailConfirmation = require("../controllers/SendEmailConfirmation");
const CodeForComanyChef = require("../models/CodeForComanyChef");
const CodeForEmp = require("../models/CodeForEmp");


exports.addCompany =(req , res)=>{

    User.findOne({
         "email": req.body.emailChef 
        })
    .then(userfind => {
        if(userfind == null){
            res.status(200).json({"operation" : "userfind null"});

        }
        else{

            console.log("test company")

            console.log(userfind)
            const company = new Company({
                ChefEmail : userfind.email,
                nameCompany : req.body.nameCompany
            })

            console.log(company)


            company.save()
                .then(() => {
                    // res.status(200).json({"operation" : company});

                    let codeInt = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

                    SendEmailConfirmation(userfind.email,
                    "Congratulations and Your Admin Code for Joining Our Platform,"+ company.nameCompany +"!",
                    "Dear  "+ company.nameCompany + ","+
                    "We are thrilled to have you as a part of [Platform Name] and want to thank you for choosing our platform for buying companies. We are excited to see what <a href='#'>" +
                    company.nameCompany+"</a> will achieve with the support of our platform.  <br><b>"+
                    "As a special congratulations, we would like to provide you with your admin code to join a company on our platform. Your code is <a href='#'>"+ codeInt.toString()+
                    "</a>. Please use this code to join a company as an admin and gain full access to all the resources and tools available."
                    )
                    const codeForComanyChef = new CodeForComanyChef({
                        code : codeInt,
                        User : userfind,
                        Company : company
                    })

                    codeForComanyChef.save()
                    .then( () => {

                        res.status(200).json({
                            "operation" : "add Company",
                            "company" : company,
                            "confirmation" : codeForComanyChef
                    
                        });

                    })


                })


        }
    })
    .catch(error => {

        res
        .status(201)
        .send({ "error": error });


    })
    
};



exports.addEmpToCompanyByEmailChef = (req,res) => {
    console.log("test addEmpToCompanyByEmailChef")
    console.log(req.body)


















    Company.findOne({"ChefEmail" : req.body.emailChef})
                .then(companyFound => {


                    if(companyFound != null && companyFound != undefined)
                    {
                        User.findOne({
                            "email": companyFound.ChefEmail[0] 
                           })
                        .then(userFoundChef => {
    
                            
                            if(userFoundChef != null && userFoundChef != undefined)
                            {

                                





                                User.findOne({
                                    "email": req.body.emailEmp 
                                   })
                                .then(userFoundEmp => {
            
                                    
                                    if(userFoundEmp != null && userFoundEmp != undefined)
                                    {
        
                                        

                                        companyFound.WorkersEmail.push(userFoundEmp.email)
                                        companyFound.save()
                                        .then((companyFoundSaved) => {

                                            

                                            let codeInt = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
                                            SendEmailConfirmation(userFoundEmp.email,
                                                "Congratulations on Your New Job at Our Company!",
                                                "Dear   <a href='#'>"  + userFoundEmp.lastName +"</a><br><br>"+
                                                "I am thrilled to inform you that you have been hired as  <a href='#'>"+ req.body.role+"</a>  at <a href='#'> "+ companyFoundSaved.nameCompany +" </a>! Congratulations on this exciting new chapter in your career. <br><br>"+
                                                "Your badge code is <a href='#'>"+ codeInt.toString() +"</a>. Please bring this code with you on your first day so that you can get started right away. <br><br>"+
                                                "We look forward to having you as part of our team and wish you all the best in your new role.  <br><br><br>"+
                                                "Sincerely,<br><a href='#'>"+companyFoundSaved.nameCompany +"</a>"
                                                                                               
                                                )


                                                let codeForEmpFound = new CodeForEmp({
                                                    code : codeInt,
                                                    Company : companyFound,
                                                    User : userFoundEmp
                                                })        
                                                
                                                codeForEmpFound.save()


                                                
                                            



                                            return res.status(200).json({
                                                "message" : "add Employ for this company   " + companyFoundSaved.nameCompany ,
                                                "company" :companyFoundSaved,
                                                "codeForEmpFound" : codeForEmpFound
                                            });

                                        })
                                        .catch(err => {

                                            return res.status(200).json({
                                                "error": err,
                                                "message" : "companyFoundSaved catch"
                                            });
                                        })


        
                                    }
                                    else{
        
                                        return res.status(200).json({
                                            "error": err,
                                            "message" : "userFoundEmp "
                                        });
                                    }            
                                })
                                .catch(err => {
                
                                  return res.status(200).json({
                                    "error": err,
                                    "message" : "userFoundEmp not found catch"
                                  });
                              
                                })
                            }            
                            else{

                                return res.status(200).json({
                                    "error": err,
                                    "message" : "userFoundEmp catch"
                                });
                            }


                            
    
                      
    
    
                        })
                        .catch(err => {
        
                          return res.status(200).json({
                            "error": err,
                            "message" : "userFoundChef not found found"
                          });
                      
                        })

                    }
                    else
                    {

                        return res.status(200).json({
                            "error": err,
                            "message" : "company not found"
                          });
                    }
                })
                .catch(err => {

                  return res.status(200).json({
                    "error": err,
                    "message" : "company not found"
                  });
              
                })





}



