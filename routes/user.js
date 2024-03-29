const express = require("express")
const userController=require("../controllers/user")
const multer = require('../middlewares/multer-config')
const { check } = require("express-validator");
const { sign } = require("crypto");
const auth = require("../middlewares/auth");
const router = express.Router();
const{
signup,
signin,
signout,
profile,
  Token,
  forgotPassword,
  resetPassword,
  addstories,
  getstories
  

}=require("../controllers/user");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/automatedAccount",userController.automatedAccount)
router.post("/createWork/:id",multer.single('image'),userController.createWork)

router.get("/getWorks/:id",userController.getWorks)


router.get("/user",getstories)
router.get("/profile/:id",auth,userController.profile);
router.post("/addstories/:id",multer.single('story'),addstories)
router.get("/signout", userController.signout);
router.get("/user/:id",userController.getUsers);
router.get("/:id/verify/:token", Token);
router.post('/forgot-password',forgotPassword);
router.post('/:id/reset-password/:token',resetPassword);
module.exports = router ;