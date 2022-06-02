// Imports
const express = require("express");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const fs = require("fs")

const route = express.Router();

// Multer DiskStrage CONFIG
const diskStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },

  destination: (req, file, cb) => {
    cb(null, "./uploads/material");
  },
});

const upload = multer({ storage: diskStorage });
// Models
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const Notification = require("../models/notificationModel");
const Material = require("../models/materialModel");

//  #################### Authentication Routes ####################
{
  route.get("/login", (req, res) => {
    const errorMessage = req.flash("error-message");
    res.render("teacher/teacher-login", { errorMessage });
  });

  route.post("/login", (req, res) => {
    const user = new Teacher({
      username: req.body.username,
      password: req.body.password,
    });

    passport.authenticate("teacherStrategy", (err, user) => {
      if (err) {
        console.log(err);
      } else if (!user) {
        req.flash("error-message", "Invalid Credentials");
        res.redirect("/teacher/login");
      } else {
        req.login(user, (err) => {
          if (!err) res.redirect("/teacher/home");
        });
      }
    })(req, res);
  });

  route.get("/signup", (req, res) => {
    res.render("teacher/teacher-signup");
  });

  // Create Teacher Account
  route.post("/signup", (req, res) => {
    let _deptHandled = [];
    if (req.body.departmentsHandled) {
      req.body.departmentsHandled.forEach((e) => {
        _deptHandled.push(e);
      });
    }

    let newTeacherAccount = new Teacher({
      username: req.body.username,
      staffName: req.body.staffName,
      mobileNumber: req.body.mobileNumber,
      departmentHandled: _deptHandled,
      accountType: "teacher",
    });
    Teacher.register(newTeacherAccount, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("teacherStrategy")(req, res, () => {
          res.redirect("/teacher/home");
        });
      }
    });
  });

  route.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  route.get("/home", (req, res) => {
    console.log("Inside /home \n User = " + req.user);
    if (req.isAuthenticated()) {
      console.log(req.user);
      res.render("teacher/teacher-home", { staffName: req.user.staffName });
    } else {
      res.redirect("/teacher/login");
    }
  });

  //  ######################################## Notification Routes ########################################

  route.get("/notification", (req, res) => {
    if (req.isAuthenticated() && req.user.accountType === "teacher") {
      res.render("teacher/teacher-notification", {
        department: req.user.departmentHandled,
      });
    } else {
      res.redirect("/");
    }
  });

  route.post("/notification", (req, res) => {
    let newNotification = new Notification({
      notificationTitle: req.body.notificationTitle,
      notificationMessage: req.body.notificationMessage,
      department: req.body.department,
      year: req.body.year,
      postedTime: new Date(),
      staffName: req.user.staffName,
      username: req.user.username,
    });
    newNotification.save((err) => {
      console.log(newNotification);
      if (!err) res.redirect("/teacher/notification");
    });
  });

  route.get("/postedNotification", (req, res) => {
    if (req.isAuthenticated() && req.user.accountType === "teacher") {
      Notification.find({ username: req.user.username })
        .sort({ _id: -1 })
        .find((err, foundNotifications) => {
          if (!err) {
            console.log(foundNotifications);
            res.render("teacher/teacher-posted-notifications", {
              foundNotifications: foundNotifications,
            });
          }
        });
    } else {
      res.redirect("/teacher/login");
    }
  });

  route.post("/postedNotification", (req, res) => {
    if (req.isAuthenticated && req.user.accountType === "teacher") {
      console.log(req.body);
      if (Object.keys(req.body)[0] === "delete") {
        Notification.deleteOne({ _id: req.body.delete }, (err) => {
          if (!err) {
            res.redirect("/teacher/postedNotification");
          }
        });
      } else if (Object.keys(req.body)[0] === "update") {
        Notification.findOne(
          { _id: req.body.update },
          (err, foundNotification) => {
            if (!err) {
              res.render("teacher/teacher-update-posted-notification", {
                postedNotification: foundNotification,
                postedStaffDetails: req.user,
              });
            }
          }
        );
      }
    } else {
      res.redirect("/teacher/login");
    }
  });

  route.post("/updatePostedNotification", (req, res) => {
    if (req.isAuthenticated() && req.user.accountType === "teacher") {
      req.body.postedTime = new Date();
      Notification.findOneAndUpdate({ _id: req.body.id }, req.body, (err) => {
        if (!err) {
          res.redirect("/teacher/postedNotification");
        }
      });
    } else {
      res.redirect("/teacher/login");
    }
  });

  route.get("/generateReport", (req, res) => {
    if (req.isAuthenticated() && req.user.accountType === "teacher") {
      res.render("teacher/teacher-generateReport", {
        teacherDetails: req.user,
      });
    } else {
      res.redirect("/teacher/login");
    }
  });

  route.post("/generateReport", (req, res) => {
    console.log(req.body);
    Student.find({ department: req.body.department, year: req.body.year })
      .sort({ username: 1 })
      .find((err, studentDetails) => {
        res.render("teacher/teacher-generatedReport", {
          studentDetails: studentDetails,
        });
      });
  });
}
// ######################################## Material Routes ########################################

route.get("/material", (req, res) => {
  if (req.isAuthenticated() && req.user.accountType === "teacher") {
    res.render("teacher/teacher-material", {
      message: req.flash("message"),
      dept: req.user.departmentHandled,
    });
  } else {
    res.redirect("/teacher/login");
  }
});

route.post("/material", upload.single("material"), (req, res) => {
  console.log("req.body = ", req.body);
  console.log("req.file = ", req.file);

  let fileDetails = new Material({
    filePath: path.join(__dirname, "../uploads/material/") + req.file.filename,
    subject: req.body.subject,
    title: req.body.title,
    dept: req.body.dept,
    year: req.body.year,
    postedStaff: req.user.staffName,
    postedTime: new Date(),
  });
  fileDetails.save((err) => {
    if (!err) {
      req.flash("message", "Uploaded Successfully");
      res.redirect("/teacher/material");
    }
  });
});

route.get("/postedMaterial", (req, res) => {
  if (req.isAuthenticated() && req.user.accountType === "teacher") {
    Material.find({ postedStaff: req.user.staffName })
      .sort({ date: -1 })
      .find((err, foundMaterials) => {
        if (!err) {
          res.render("teacher/teacher-posted-materials", {
            foundMaterials: foundMaterials,
          });
        }
      });
  } else {
    res.redirect("/teacher/login");
  }
});

route.post("/postedMaterial", (req, res) => {
  console.log(req.body)
  Material.findById(req.body.id, (err, foundData) => {
    if (!err) {
      console.log("foundData : "+ foundData);
      fs.unlink(foundData.filePath, (error) => {
        console.log(error)
        if (!error) {
          console.log("Removed Locally")
          Material.findByIdAndRemove(req.body.id, (e) => {
            if (!e) {
              console.log("Removed from DB")
              res.redirect("/teacher/postedMaterial");
            }
          });
        }
      });
    }
  });
});

route.get("/marksheet", (req, res) => {
  if (req.isAuthenticated && req.user.accountType === "teacher") {
    res.render("teacher/teacher-marksheet");
  } else {
    res.redirect("/");
  }
});

route.post("/marksheet", (req, res) => {});

module.exports = route;
