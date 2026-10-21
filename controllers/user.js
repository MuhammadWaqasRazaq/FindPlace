const User = require("../models/user.js");

module.exports.renderSignupForm=(req, res) => {
  res.render("user/signup.ejs");
}
module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerduser = await User.register(newUser, password);

      console.log(registerduser);
      req.login(registerduser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to FindPlace");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm=(req, res) => {
  res.render("user/login.ejs");
}

module.exports.login=async (req, res) => {
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    req.flash("success", "Welcome to FindPlace");
    res.redirect(redirectUrl);
  }

  module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are loged out");
    res.redirect("/listings");
  });
}