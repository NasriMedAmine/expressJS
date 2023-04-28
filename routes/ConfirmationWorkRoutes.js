const express = require("express");
const router = express.Router();
const ConfirmationWorksController = require("../controllers/ConfirmationWorksController");


router.post("/AddConfirmation",ConfirmationWorksController.ConfirmationJob)
router.post("/CheckConfirmation",ConfirmationWorksController.VerifieCode)



 
module.exports = router;