const ApplicationsForm = require("../models/ApplicationsForm");

const ObjectId = require("mongodb").ObjectId;

exports.addApplication = (req, res) => {
    let Apply = new ApplicationsForm({ ...req.body , Cv:req.file.filename });
    console.log(req.file)
    Apply.save((erro, Apply) => {
      if (erro) {
        return res.status(400).json({
          error: "unable to add work",
        });
      }
      return res.json({
        message: "sucsess",
        Apply,
      });
    });
    console.log(Apply);
  };
  
  exports.getApplications = (req, res) => {
    const jobOwner = req.params.jobOwner;
    ApplicationsForm.find({jobOwner})
        .then((ApplicationsForm) => {
          res.status(200).json({ massage: "sucsses", ApplicationsForm });
        })
        .catch((error) => {
          res.status(400).json({
            error: "worker dosen't exist",
          });
        });
    };

  