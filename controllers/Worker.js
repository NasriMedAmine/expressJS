const User = require("../models/User");
const Worker = require("../models/Worker");
const toWorker = require("./user")


exports.addWorker = (req, res) => {
    const { firstName, lastName, email, password, address, mobileNumber, image, entreprise , owner } = req.body;
  
    Worker.findOne({ email }).then(existingWorker => {
      if (existingWorker) {
        return res.status(400).json({ error: "Worker already exists" });
      } else {
        const newWorker = new Worker({
          firstName,
          lastName,
          email,
          address,
          mobileNumber,
          image,
          entreprise,
          owner
        });
  
        newWorker.setPassword("azerty123");
        newWorker.save()
          .then(() => {
            res.status(200).json({ message: "Worker created !" });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};


    exports.getAllWorkers = (req, res) => {
      const owner = req.params.owner;
        Worker.find({owner})
          .then((worker) => {
            res.status(200).json({ massage: "sucsses", worker });
          })
          .catch((error) => {
            res.status(400).json({
              error: "worker dosen't exist",
            });
          });
      };