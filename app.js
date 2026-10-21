require("dotenv").config();
const express = require("express");
const app = express();
const ejsMate=require("ejs-mate");
const mongoose = require("mongoose");
const methedOverrode=require("method-override");
const path=require("path");
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const flash=require("connect-flash");
const mongoStore=require("connect-mongo");
const listingRouter = require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const MongoStore = require("connect-mongo");


app.set("view engine", "ejs");
app.engine("ejs",ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({extended:true}));
app.use(methedOverrode("_method"));

const dns = require('dns');
dns.setServers(['1.1.1.1','8.8.8.8']);




const dburl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/findplace_dev';

const PORT = process.env.PORT || 8080;

//connect database 
main()
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  // Connection options: set TLS only for SRV/Atlas connections. Use a sensible timeout.
  const useSrv = dburl.startsWith('mongodb+srv');
  const connectOptions = {
    serverSelectionTimeoutMS: 30000,
    // enable TLS when using mongodb+srv (Atlas). For local `mongodb://` this will be false.
    tls: useSrv,
    // Allow invalid certs only when explicitly requested for local debugging.
    tlsAllowInvalidCertificates: useSrv && process.env.SKIP_TLS_VERIFY === 'true',
    // Use the new URL parser and unified topology are defaults in mongoose v8+, no need to set.
  };

  await mongoose.connect(dburl, connectOptions);
}

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MANOGO SESSION STORE",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 *1000,
    maxAge: 7 * 24 * 60 * 60 *1000,
    httpOny:true,
  },
};

// Home route
app.get("/", (req, res) => {
  res.redirect("/listings");
});



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})


// express router
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter)




// 404 handler
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

// Error handler
app.use((err,req,res,next)=>{
  let {status = 500, message = "Something went wrong"} = err;
   res.status(status).render("./listings/error.ejs", { message });
});

//server listening
app.listen(PORT, () => {
  console.log(`server is listening at port ${PORT}`);
});