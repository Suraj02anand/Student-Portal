// Imports
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const route = express.Router();
const https = require("https");

// Models
const Student = require("../models/studentModel");
const Notification = require("../models/notificationModel");
const Material = require("../models/materialModel")

// ######################################## Authentication Routes ########################################

route.get("/login", (req, res) => {
  const errorMessage = req.flash("error-message");
  res.render("student/student-login", { errorMessage });
});

route.post("/login", (req, res) => {
  passport.authenticate("studentStrategy", (err, user) => {
    if (err) {
      req.flash("error-message", err.message);
      res.redirect("/student/login");
    } else if (!user) {
      req.flash("error-message", "Invalid Credentials");
      res.redirect("/student/login");
    } else {
      req.login(user, (err) => {
        if (!err) {
          res.redirect("/student/home");
        }
      });
    }
  })(req, res);
});

route.get("/signup", (req, res) => {
  res.render("student/student-signup");
});

// Create Student Account
route.post("/signup", (req, res) => {
  let newStudentAccount = new Student({
    username: req.body.username,
    studentName: req.body.studentName,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    department: req.body.department,
    year: req.body.year,
    accountType: "student",
  });

  Student.register(newStudentAccount, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.render("student/student-signup", { error: err });
    } else {
      console.log(user);
      passport.authenticate("studentStrategy")(req, res, () => {
        res.redirect("/student/home");
      });
    }
  });
});

route.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

route.get("/home", (req, res) => {
  if (req.isAuthenticated() && req.user.accountType === 'student')  {
    console.log(req.user);
    res.render("student/student-home", { studentName: req.user.studentName });
  } else {
    res.redirect("/student/login");
  }
});

//######################################## Notification Routes ########################################

route
  .route("/notification")
  .get((req, res) => {
    if (req.isAuthenticated() && req.user.accountType === 'student') {
      Notification.find(
        {
          department: req.user.department,
          $or: [{ year: 0 }, { year: req.user.year }],
        },
        (err, foundNotifications) => {
          if (!err) {
            console.log(foundNotifications);
            res.render("student/student-notification", {
              notificationObject: foundNotifications,
            });
          }
        }
      );
    } else {
      res.redirect("/student/login");
    }
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.isAuthenticated() && req.user.accountType === 'student') {
      Notification.findOne({ _id: req.body.id }, (err, foundNotification) => {
        if (!err) {
          res.render("student/student-single-notification", {
            foundNotification: foundNotification,
          });
        }
      });
    }
  });


// ######################################## Material Routes ########################################
route.get("/material" , (req,res) => {
  if (req.isAuthenticated() && req.user.accountType === 'student') {
    Material.find( {year : req.user.year , dept : req.user.department}).sort({postedTime : -1}).find((err,foundData) => {
      if(!err){
        if(foundData) {
          res.render("student/student-material", {data : foundData})
        }
        else{
          res.render("student/student-material" , {data : {}})
        }
      }
    })
  }
  else{
    res.redirect("/student/login")
  }
})


route.post("/material" , (req,res) => {
    console.log(req.body)
    Material.findById(req.body.id , (err,foundData) => {
      if(!err){
        res.download(foundData.filePath)
      }
    })
})

// ######################################## Books Routes ########################################

route.get("/books", (req, res) => {
  let jsonArray = []
  res.render("books" , {jsonArray});
});



route.post("/books", (req, res) => {
  if (req.body.book.trim() < 2) {
    res.redirect("/student/books");
  } else {
    let searchedBook = req.body.book.trim();;
    let url = "https://www.googleapis.com/books/v1/volumes?q="+searchedBook;
    let data = "";
    https.get(url, (response) => {
      response.on("data", (chunks) => {
        data += chunks;
      });
      response.on("end", () => {
        let jsonArray = JSON.parse(data).items
        res.render("books" , {jsonArray})
        console.log(jsonArray)
      });
    });
  }
});



module.exports = route;
