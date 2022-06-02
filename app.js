// Imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Models
const Student = require("./models/studentModel");
const Teacher = require("./models/teacherModel");
const Admin = require("./models/adminModel")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(flash())

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/student", express.static("public"));
app.use("/teacher", express.static("public"));
app.use("/admin", express.static("public"));

app.use(
  session({
    secret: "Secret Comes Here.",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

let mongoURI = process.env.MONGO_DB_URL_1 + encodeURIComponent(process.env.MONGO_DB_PASSWORD) + process.env.MONGO_DB_URL_2;

console.log(mongoURI);
mongoose.connect(mongoURI, (err) => {
  if(!err){
    console.log("Successfully Connected To MongoDB");
  }
  else{
    console.log(err)
    console.log('Error While connecting to MongoDB')
  }
});
encodeURIComponent()

passport.use("studentStrategy", Student.createStrategy());
passport.use("teacherStrategy", Teacher.createStrategy());
passport.use("adminStrategy" , Admin.createStrategy());

passport.serializeUser((user, done) => {
  done(null, { _id: user.id, accountType: user.accountType });
});

passport.deserializeUser((obj, done) => {
  if (obj.accountType === "student") {
    Student.findById(obj._id, (err, foundUser) => {
      done(err, foundUser);
    });
  } else if (obj.accountType === "teacher") {
    Teacher.findById(obj._id, (err, foundUser) => {
      done(null, foundUser);
    });
  }else if (obj.accountType === "admin") {
    Admin.findById(obj._id, (err , foundUser) =>{
      done(null , foundUser)
    })
  }
});

// Routers
const indexRoute = require("./routes/indexRoutes");
const studentRoute = require("./routes/studentRoutes");
const teacherRoute = require("./routes/teacherRoutes");
const adminRoute = require("./routes/adminRoutes");

// Routes
app.use("/", indexRoute);
app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);
app.use("/admin", adminRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is up and running");
});
