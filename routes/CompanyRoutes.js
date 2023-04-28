const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/CompanyController");


router.post("/addCompany",CompanyController.addCompany)
router.post("/addEmpForCompany",CompanyController.addEmpToCompanyByEmailChef)



 
module.exports = router;