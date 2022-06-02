require("dotenv").config();
const route = require("express").Router();
const passport = require("passport");

// Model
const Admin = require("../models/adminModel");
const Student = require("../models/studentModel")
const Teacher = require("../models/teacherModel")
const Notification = require("../models/notificationModel")

// Default Username password insertion
Admin.find((err, foundUser) => {
  if (!err) {
    if (foundUser.length === 0) {
      let newUser = new Admin({
        username: process.env.ADMIN_USERNAME,
        accountType: "admin",
      });
      Admin.register(newUser, process.env.ADMIN_PASSWORD, (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/admin/login", { err });
        } else {
          console.log(user);
        }
      });
    }
  }
});

// Login Routes
route.get("/login", (req, res) => {
  const errorMessage = req.flash("error-message");
  res.render("admin/admin-login", { errorMessage });
});

route.post("/login", (req, res) => {
  passport.authenticate("adminStrategy", (err, user) => {
    if (err) {
      req.flash("error-message", err.message);
      res.redirect("/admin/login");
    } else if (!user) {
      req.flash("error-message", "Invalid Credentials");
      res.redirect("/admin/login");
    } else {
      req.login(user, (err) => {
        if (!err) {
          res.redirect("/admin/home");
        }
      });
    }
  })(req, res);
});

// Student Dashboard
// ###################
route.get("/students" , (req,res)=>{
  if(req.isAuthenticated() && req.user.accountType === 'admin'){
    Student.find({}).sort({"year" : 1 , "department" : 1}).find((err, foundUsers) => {
      if(!err){
        res.render("admin/student-dashboard" , {foundUsers})
      }
    })
  }else{
    res.redirect("/admin/login");
  }
})

route.post("/students" , (req,res) => {
  console.log(req.body.id)
  Student.deleteOne({_id : req.body.id }, (err)=>{
    if(!err){
      res.redirect("/admin/students")
    }
    else{
      console.log("Unable to delete")
    }
  })
})
// ###################



// Teacher Dashboard
// ###################
route.get("/teachers" , (req,res) => {
  if(req.isAuthenticated() && req.user.accountType === 'admin'){
    Teacher.find({} , (err,foundUsers) => {
      if(!err){
        res.render("admin/teacher-dashboard" , {foundUsers})
      }
    })
  }
  else{
    res.redirect("/admin/login")
  }
})

route.post("/teachers" , (req,res) => {
  console.log(req.body)
  Teacher.findOneAndRemove({_id : req.body.id} , (err) => {
    if(!err){
      res.redirect("/admin/teachers")
    }
    else{
      console.log('Unable to Remove')
    }
  })
})
// ###################



// Notification
// ###################
route.get("/notifications" , (req,res) => {
  if(req.isAuthenticated() && req.user.accountType === 'admin'){
    Notification.find({},(err,foundNotifications) => {
      res.render("admin/notification-dashboard" , {foundNotifications})
    })
  }
  else{
    res.redirect("/admin/login")
  }
})

route.post("/notifications" , (req,res)=>{
  console.log(req.body)
  Notification.findByIdAndRemove({_id : req.body.id} , (err) =>{
    if(!err){
      res.redirect("/admin/notifications")
    }
    else{
      console.log("Unable to Delete..")
    }
  })
})
// ###################

// Marksheet
route.get("/marksheet" , (req,res) => {
  res.redirect("/admin/generate-table-1");
})


route.get("/generate-table-1" , (req,res) => {
  if(req.isAuthenticated() && req.user.accountType === 'admin'){
    res.render("admin/generate-table-1");
  }
})

route.post("/generate-table-1" , (req,res) => {
  if(req.user.accountType === 'admin'){
    res.render("admin/generate-table-2" , {details : req.body})
  }
})

route.post("/admin/generate-table-2" , (req,res) => {
  console.log(req.body)
})

// Home 
route.get("/home", (req, res) => {
  if(req.isAuthenticated() && req.user.accountType === 'admin'){
    console.log(req.user)
    res.render("admin/admin-home")
  } else {
    res.redirect("/admin/login");
  }
});



// Logout
route.get("/logout" , (req,res) => {
  if(req.user.accountType === 'admin'){
    req.logout()
    res.redirect("/")
  }
  else{
    res.redirect("/")
  }
})

module.exports = route;
