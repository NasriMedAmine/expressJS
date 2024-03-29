const User = require("../models/User");
const Work = require("../models/Works")
const Company = require("../models/Company")


const bcrypt = require("bcryptjs");
const crypto = require("crypto");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const { body } = require("express-validator");
const Token = require("../models/Token");
const urll = "http://localhost:5000/api";
var aes256 = require('aes256');
const resetToken = require("../models/resetToken");

const sendEmail = require("../controllers/sendEmail");
const resetPassword = require("../controllers/resetPassword");
const { url } = require("inspector");
const Joi = require("joi");

const router = require("../routes/user");
//signup
exports.signup=async(req , res)=>{
try{
    let user = await User.findOne(
        ({firstName, lastName, email, password}=req.body)
    );
    if(user)
    return res
    .status(409)
    .send({message:"user with given email already exist"});
    user = new User({...req.body});
    user.setPassword(req.body.password);
    await user.save();
    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url =`${urll}/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);
    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
//verify with link 
exports.Token = async (req, res) => {
    // Find a matching token
    Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token)
        return res.status(400).send({
          type: "not-verified",
          msg: `We were unable to find a valid token.Your token my have expired.`,
        });
  
      // If we found a token, find a matching user
      User.findOne({ _id: token.userId }, function (err, user) {
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this token." });
        if (user.verified)
          return res.status(400).send({
            type: "already-verified",
            msg: "This user has already been verified.",
          });
  
        // Verify and save the user
        user.verified = true;
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The account has been verified. Please login.");
        });
      });
    });
  };
  //signin
  exports.signin = (req, res) => {

    console.log("test signin")
    console.log(req.body)


    console.log(req.body.email)



    User.findOne({ "email": req.body.email }, function (err, user) {
      if (user === null) {
        console.log("usernotFound")

        return res.status(401).send({
          message: "User not found.",
        });
        } 
        else if (user.validPassword(req.body.password) && user.verified == true) {
        


          console.log(req.body)



          



          Company.findOne({
            "ChefEmail" : user.email
          })
          .then(companyFound => {
            console.log(companyFound)

            if(companyFound == null){

              console.log(companyFound)




              Company.findOne({
                "WorkersEmail" : user.email
              })
              .then( companyFound2 => {


                if(companyFound2 == null){
                  console.log(companyFound2)

                  return res.json({
                    "operation" : "LoginDone",
                    "token": jwt.sign(
                      { email: user.email, firstName: user.firstName, _id: user._id },
                      "RESTFULAPIs"
                    ),
                    "user" : user,
                    "company" : null,
                    "Role" : "No"
                    
                  });

                }
                else{
                  console.log(companyFound2)

                  return res.json({
                    "operation" : "LoginDone",
                    "token": jwt.sign(
                      { email: user.email, firstName: user.firstName, _id: user._id },
                      "RESTFULAPIs"
                    ),
                    "user" : user,
                    "company" : null,
                    "Role" : "dev"
                    
                  });
                }


                

              })




              // return res.json({
              //   "operation" : "LoginDone  NO",
              //   "token": jwt.sign(
              //     { email: user.email, firstName: user.firstName, _id: user._id },
              //     "RESTFULAPIs"
              //   ),
              //   "user" : user,
              //   "company" : null,
              //   "Role" : "No"
                
              // });




              
    







              



              






            }
            else{

              return res.json({
                "operation" : "LoginDone",
                "token": jwt.sign(
                  { email: user.email, firstName: user.firstName, _id: user._id },
                  "RESTFULAPIs"
                ),
                "user" : user,
                "company" : companyFound,
                "Role" : "chef"
              });
            }
          })
          .catch(error => {

            return res.json({
              "operation" : "LoginDone NO",
              "token": jwt.sign(
                { email: user.email, firstName: user.firstName, _id: user._id },
                "RESTFULAPIs"
              ),
              "user" : user,
              "company" : null

            });
          })


          






        } 
        else if (
          user.validPassword(req.body.password) &&
          user.verified == false
        ) {
          return res.status(400).send({
            message: "user not verified",
          });
        } else {
          return res.status(400).send({
            message: "Wrong Password or user not verified",
          });
        }
      
    });
  };
  //------------------------------forgot password------------------//
exports.forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(409)
        .send({ message: "User with given email not Exist!" });

    /*const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);*/
    const token = await new resetToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${urll}/${user._id}/reset-password/${token.token}`;
    await resetPassword(user.email, "reset Password Email", url);
    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
//--------------------------reset password-----------------------//
exports.resetPassword = async (req, res) => {
  resetToken.findOne({ token: req.params.token }, function (err, token) {
    if (!token)
      return res.status(400).send({
        type: "not-exist",
        msg: `We were unable to find a valid token.Your token my have expired.`,
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token.userId }, function (err, user) {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user for this token." });

      // Verify and save the user
      user.password = req.body.password;
      user.setPassword(req.body.password);

      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).send("The password has been changed. Please login.");
      });
    });
  });
};
//--------------------------signout---------------------------//
exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "user signout",
  });
};
//-------------------------makeWorker---------------------------//

exports.makeWorker = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { userType: "Worker"} },
    { new: true, upsert: false }
  )
    .then((users) => {
      res.status(200).json({ users , message: "changed !"});
      console.log(user.userType)
    })
    .catch((error) => {
      res.satus(400).json({ error, message: "faild" } );
    });
};

exports.profile = async (req,res)=>{
  try{
    const user = await User.findById({_id:req.params.id});
    if(!user){
      return res.json({message:'No user found'})
    }
    res.json(user)
  }catch(error){
    res.status(500).json(error)
  }
}
exports.getUsers=async (req,res)=>{
  try {const user = await User.findById({_id:req.params.id})
  if(req.body.stories != null)
  {
    res.json(user)
    }


} catch (error) {
res.status(500).json(error)}
}

exports.addstories = (req, res) => {


  console.log("haniji")
  console.log(req.body)
  console.log(req.params)
  console.log(req.file)



   User
    .findByIdAndUpdate(
      { _id: req.params.id },
      {$push:{
        stories:{...req.body,
          story:req.file.filename
        },
        
    

      
     

      },
      

     

    }
      //{ ...req.body, _id: req.params.id }
    )
    .then(() => res.status(200).json({ message: "story ajouter" }))
    .catch((error) => res.status(400).json({ error }));
}



exports.getUsers = async (req, res) => {
 
  try {
   const bou = await User.findById({ _id: req.params.id })
   res.status(200).json(bou)
  } catch (error) {
   res.status(400).json(error)
  }
};

exports.getstories=async (req, res) => {
  try {
    
    const bou = await User.find({ stories: { $ne: null } })
    res.json(bou)

  } catch (error) {
    res.status(500).json(error)
  }
}
exports.automatedAccount = async (req,res)=>{
  try{
    let user = await User.findOne(
       {email : req.body.email}
    );
    if(user)
    return res
    .status(409)
    .send({message:"user with given email already exist"});
    user = new User({...req.body});
    user.setPassword(req.body.firstName+"Azerty");
    await user.save();
    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url =
    `verify your account via this link : ${urll}/${user._id}/verify/${token.token} 
      and connect with your password  : ${user.firstName}Azerty
      welcome to meta co-working space  `;
    await sendEmail(user.email, "Take your access", url);
    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}


exports.createWork = async (req, res) => {
  try {
    console.log("haniji");
    console.log(req.body);
    console.log(req.params);
    
    const userId = req.params.id;
    const user = await User.findById(userId);

    const form = {
      positionname: req.body.positionname,
      society:req.body.society,
      details: req.body.details,
      numberOfposition: req.body.numberOfposition,
      user: user._id,
      image : req.file.filename
    };

    const newWork = await Work.create(form);

    await User.findByIdAndUpdate(
      userId,
      { $push: { Works: newWork._id } },
      { new: true, useFindAndModify: false }
    );

    console.log(newWork);
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

    exports.getWorks = async (req, res) => {
      try {
        const userWorks = await User.findById(req.params.id).populate({
          path: 'works',
          select: 'positionname society details numberOfposition ',
        });
        console.log(userWorks)
        if (!userWorks) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json({ works : userWorks.works });
        
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };