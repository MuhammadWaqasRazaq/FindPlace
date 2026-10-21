const express = require("express");
const router = express.Router();

const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { savedredirctUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");


router.route("/signup")
.get(userController.renderSignupForm)//signupform
.post(wrapasync(userController.signup));//signup


router.route("/login")
.get(userController.renderLoginForm)
.post(savedredirctUrl,passport.authenticate("local",
   {failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login);

  
router.get("/logout", userController.logout);

module.exports = router;
